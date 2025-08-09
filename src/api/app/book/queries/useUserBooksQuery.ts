import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { useInfiniteQuery } from '@tanstack/react-query';

import { UserBook } from 'api/app/types';
import { BookResult } from 'api/google-books/search';

const SNAPSHOT_LENGTH = 15;

interface QueryResult {
  books: (UserBook & Partial<BookResult>)[];
  lastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
}

export const useUserBooksQuery = ({
  withRefs,
}: { withRefs?: boolean } = {}) => {
  return useInfiniteQuery<QueryResult>({
    queryKey: ['userBooks', withRefs],
    queryFn: async ({ pageParam }) => {
      const userId = auth().currentUser?.uid;
      if (!userId) return { books: [], lastDoc: null };

      let query = firestore()
        .collection('users')
        .doc(userId)
        .collection('books')
        .limit(SNAPSHOT_LENGTH);

      if (pageParam) {
        query = query.startAfter(pageParam);
      }

      const snapshot = await query.get();

      const books = await Promise.all(
        snapshot.docs.map(async doc => {
          const bookData = { id: doc.id, ...(doc.data() as UserBook) };
          if (withRefs && bookData.bookRef) {
            const refData = (await bookData.bookRef.get()).data() as BookResult;
            return { ...bookData, ...refData };
          }
          return bookData;
        }),
      );

      return {
        books,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    },
    initialPageParam: null,
    getNextPageParam: lastPage => lastPage.lastDoc,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
