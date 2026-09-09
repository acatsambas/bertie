import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { updateGuestProfile } from 'api/guest/guestStore';

interface UpdateContactEmailParams {
  contactEmail: string;
}

export const useUpdateContactEmailMutation = () => {
  const queryClient = useQueryClient();
  const { isGuest } = useGuest();

  return useMutation({
    mutationFn: async ({ contactEmail }: UpdateContactEmailParams) => {
      if (isGuest) {
        await updateGuestProfile({ contactEmail });
        return { contactEmail };
      }

      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      await updateDoc(doc(db, 'users', userId), {
        contactEmail,
      });

      return { contactEmail };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });
};
