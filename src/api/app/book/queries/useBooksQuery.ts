import { useQuery } from '@tanstack/react-query';
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';

export const useBooksQuery = ({ ids }: { ids: string[] } = { ids: [] }) => {
  return useQuery<BookResult[]>({
    queryKey: ['books', ids],
    queryFn: async () => {
      if (!ids.length) return [];

      const q = query(collection(db, 'books'), where(documentId(), 'in', ids));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BookResult,
      );
    },
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
