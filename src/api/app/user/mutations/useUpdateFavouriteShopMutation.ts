import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';

interface UpdateFavouriteShopParams {
  shopId: string;
}

export const useUpdateFavouriteShopMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shopId }: UpdateFavouriteShopParams) => {
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
