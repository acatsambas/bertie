import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';

import { UserShop } from 'api/app/types';
import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { readGuestData } from 'api/guest/guestStore';

export const useFavouriteShopsQuery = () => {
  const { isGuest } = useGuest();

  return useQuery<UserShop[]>({
    queryKey: ['favouriteShops', isGuest],
    queryFn: async () => {
      if (isGuest) {
        const { favouriteShops } = await readGuestData();
        // A guest has no Firestore documents, so there is no shopRef to hand
        // back; callers only ever read `id` off these.
        return favouriteShops.map(id => ({ id }) as UserShop);
      }

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
    enabled: isGuest || !!auth.currentUser?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
