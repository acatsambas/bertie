import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';

interface UpdateFirstSearchFlagParams {
  isFirstSearch: boolean;
}

export const useUpdateFirstSearchFlagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isFirstSearch }: UpdateFirstSearchFlagParams) => {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      await updateDoc(doc(db, 'users', userId), {
        isFirstSearch,
      });

      return { isFirstSearch };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });
};
