import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { updateGuestProfile } from 'api/guest/guestStore';

interface UpdateFavouriteShopParams {
  shopId: string;
}

export const useUpdateFavouriteShopMutation = () => {
  const queryClient = useQueryClient();
  const { isGuest } = useGuest();

  return useMutation({
    mutationFn: async ({ shopId }: UpdateFavouriteShopParams) => {
      if (isGuest) {
        await updateGuestProfile({ favouriteShop: shopId });
        return { shopId };
      }

      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      await updateDoc(doc(db, 'users', userId), {
        favouriteShop: shopId,
      });

      return { shopId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });
};
