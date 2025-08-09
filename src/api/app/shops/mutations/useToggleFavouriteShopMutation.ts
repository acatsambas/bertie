import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ToggleFavouriteShopParams {
  shopId: string;
  isFavourite: boolean;
}

export const useToggleFavouriteShopMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shopId, isFavourite }: ToggleFavouriteShopParams) => {
      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const favouriteShopRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('favouriteShops')
        .doc(shopId);

      if (isFavourite) {
        await favouriteShopRef.delete();
      } else {
        await favouriteShopRef.set({
          shopRef: firestore().collection('shops').doc(shopId),
        });
      }

      return { shopId, isFavourite: !isFavourite };
    },
    onSuccess: () => {
      // Invalidate the favouriteShops query to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: ['favouriteShops'],
      });
    },
  });
};