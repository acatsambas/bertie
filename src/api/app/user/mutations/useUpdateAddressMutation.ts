import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserData } from 'api/types';

interface UpdateAddressParams {
  address: UserData['address'];
}

export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address }: UpdateAddressParams) => {
      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      await firestore().collection('users').doc(userId).update({
        address,
      });

      return { address };
    },
    onSuccess: () => {
      // Invalidate the user query to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });
};
