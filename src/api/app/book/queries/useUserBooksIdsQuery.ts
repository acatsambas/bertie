import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';

import { UserBookId } from 'api/app/types';

export const useUserBooksIdsQuery = () => {
  return useQuery<UserBookId[]>({
    queryKey: ['userBooksIds'],
    queryFn: async () => {
      const userId = auth().currentUser?.uid;
      if (!userId) return [];

      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('books')
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
