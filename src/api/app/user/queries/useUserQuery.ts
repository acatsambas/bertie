import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';

import { UserData } from 'api/types';

export const useUserQuery = () => {
  return useQuery<UserData | undefined>({
    queryKey: ['user'],
    queryFn: async () => {
      const uid = auth().currentUser?.uid;
      if (!uid) return undefined;

      const snapshot = await firestore().collection('users').doc(uid).get();

      return snapshot.data() as UserData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
  });
};
