import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';

import { UserShop } from 'api/app/types';

export const useFavouriteShopsQuery = () => {
  return useQuery<UserShop[]>({
    queryKey: ['favouriteShops'],
    queryFn: async () => {
      const userId = auth().currentUser?.uid;
      if (!userId) return [];

      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('favouriteShops')
        .get();

      return snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as UserShop,
      );
    },
    enabled: !!auth().currentUser?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
