import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';

import { UserBookId } from 'api/app/types';
import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { readGuestData } from 'api/guest/guestStore';

export const useUserBooksIdsQuery = () => {
  const { isGuest } = useGuest();

  return useQuery<UserBookId[]>({
    queryKey: ['userBooksIds', isGuest],
    queryFn: async () => {
      if (isGuest) {
        const { books } = await readGuestData();
        return Object.keys(books).map(id => ({ id }));
      }

      const userId = auth.currentUser?.uid;
      if (!userId) return [];

      const snapshot = await getDocs(collection(db, 'users', userId, 'books'));

      return snapshot.docs.map(doc => ({ id: doc.id }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
