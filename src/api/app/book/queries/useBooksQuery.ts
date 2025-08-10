import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';

import { BookResult } from 'api/google-books/search';

export const useBooksQuery = ({ ids }: { ids: string[] } = { ids: [] }) => {
  return useQuery<BookResult[]>({
    queryKey: ['books', ids],
    queryFn: async () => {
      if (!ids.length) return [];

      const snapshot = await firestore()
        .collection('books')
        .where(firestore.FieldPath.documentId(), 'in', ids)
        .get();

      return snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BookResult,
      );
    },
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
