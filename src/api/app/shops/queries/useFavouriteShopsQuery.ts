import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';

import { UserShop } from 'api/app/types';
import { auth, db } from 'api/firebase';

export const useFavouriteShopsQuery = () => {
  return useQuery<UserShop[]>({
    queryKey: ['favouriteShops'],
    queryFn: async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return [];

      const snapshot = await getDocs(
        collection(db, 'users', userId, 'favouriteShops'),
      );

      return snapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as UserShop,
      );
    },
    enabled: !!auth.currentUser?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
