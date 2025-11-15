import { useInfiniteQuery } from '@tanstack/react-query';
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDoc,
  getDocs,
  limit,
  query,
  startAfter,
} from 'firebase/firestore';

import { UserBook } from 'api/app/types';
import { auth, db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';

const SNAPSHOT_LENGTH = 30;

interface QueryResult {
  books: (UserBook & Partial<BookResult>)[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

export const useUserBooksQuery = ({
  withRefs,
}: { withRefs?: boolean } = {}) => {
  return useInfiniteQuery<QueryResult>({
    queryKey: ['userBooks', withRefs],
    queryFn: async ({ pageParam }) => {
      const userId = auth.currentUser?.uid;
      if (!userId) return { books: [], lastDoc: null };

      let q = query(
        collection(db, 'users', userId, 'books'),
        limit(SNAPSHOT_LENGTH),
      );

      if (pageParam) {
        q = query(q, startAfter(pageParam));
      }

      const snapshot = await getDocs(q);

      const books = await Promise.all(
        snapshot.docs.map(async doc => {
          const bookData = { id: doc.id, ...(doc.data() as UserBook) };
          if (withRefs && bookData.bookRef) {
            const refData = (
              await getDoc(bookData.bookRef)
            ).data() as BookResult;
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
