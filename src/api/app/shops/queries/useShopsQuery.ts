import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';

import { Shop } from 'api/app/types';

export const useShopsQuery = () => {
  return useQuery<Shop[]>({
    queryKey: ['shops'],
    queryFn: async () => {
      const snapshot = await firestore().collection('shops').get();

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
