import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateContactEmailParams {
  contactEmail: string;
}

export const useUpdateContactEmailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactEmail }: UpdateContactEmailParams) => {
      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      await firestore().collection('users').doc(userId).update({
        contactEmail,
      });

      return { contactEmail };
    },
    onSuccess: () => {
      // Invalidate the user query to trigger a refetch
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });
};
