import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { UserData } from 'api/types';

interface UpdateAddressParams {
  address: UserData['address'];
}

export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address }: UpdateAddressParams) => {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      await updateDoc(doc(db, 'users', userId), {
        address,
      });

      return { address };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });
};
