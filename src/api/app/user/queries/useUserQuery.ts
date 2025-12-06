import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { UserData } from 'api/types';

export const useUserQuery = () => {
  return useQuery<UserData | undefined>({
    queryKey: ['user'],
    queryFn: async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return undefined;

      const docSnapshot = await getDoc(doc(db, 'users', uid));

      if (!docSnapshot.exists()) {
        return undefined;
      }

      return docSnapshot.data() as UserData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
  });
};
