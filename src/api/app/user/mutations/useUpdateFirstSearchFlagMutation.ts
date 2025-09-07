import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateFirstSearchFlagParams {
  isFirstSearch: boolean;
}

export const useUpdateFirstSearchFlagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isFirstSearch }: UpdateFirstSearchFlagParams) => {
      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      await firestore().collection('users').doc(userId).update({
        isFirstSearch,
      });

      return { isFirstSearch };
    },
    onSuccess: () => {
      // Invalidate the user query to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });
};
