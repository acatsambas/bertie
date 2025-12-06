import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';

import { Shop } from 'api/app/types';
import { db } from 'api/firebase';

export const useShopsQuery = () => {
  return useQuery<Shop[]>({
    queryKey: ['shops'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'shops'));

      return snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Shop,
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
