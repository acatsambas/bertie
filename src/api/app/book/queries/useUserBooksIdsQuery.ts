import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';

import { UserBookId } from 'api/app/types';
import { auth, db } from 'api/firebase';

export const useUserBooksIdsQuery = () => {
  return useQuery<UserBookId[]>({
    queryKey: ['userBooksIds'],
    queryFn: async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return [];

      const snapshot = await getDocs(collection(db, 'users', userId, 'books'));

      return snapshot.docs.map(doc => ({ id: doc.id }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
