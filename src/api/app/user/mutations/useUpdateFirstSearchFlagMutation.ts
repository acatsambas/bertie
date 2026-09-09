import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { updateGuestProfile } from 'api/guest/guestStore';

interface UpdateFirstSearchFlagParams {
  isFirstSearch: boolean;
}

export const useUpdateFirstSearchFlagMutation = () => {
  const queryClient = useQueryClient();
  const { isGuest } = useGuest();

  return useMutation({
    mutationFn: async ({ isFirstSearch }: UpdateFirstSearchFlagParams) => {
      if (isGuest) {
        await updateGuestProfile({ isFirstSearch });
        return { isFirstSearch };
      }

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
