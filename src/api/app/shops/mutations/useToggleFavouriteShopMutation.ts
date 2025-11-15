import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';

interface ToggleFavouriteShopParams {
  shopId: string;
  isFavourite: boolean;
}

export const useToggleFavouriteShopMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shopId, isFavourite }: ToggleFavouriteShopParams) => {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const favouriteShopRef = doc(
        db,
        'users',
        userId,
        'favouriteShops',
        shopId,
      );

      if (isFavourite) {
        await deleteDoc(favouriteShopRef);
      } else {
        await setDoc(favouriteShopRef, {
          shopRef: doc(db, 'shops', shopId),
        });
      }

      return { shopId, isFavourite: !isFavourite };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favouriteShops'],
      });
    },
  });
};
