import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateFavouriteShopParams {
  shopId: string;
}

export const useUpdateFavouriteShopMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shopId }: UpdateFavouriteShopParams) => {
      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      await firestore().collection('users').doc(userId).update({
        favouriteShop: shopId,
      });

      return { shopId };
    },
    onSuccess: () => {
      // Invalidate the user query to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });
};
