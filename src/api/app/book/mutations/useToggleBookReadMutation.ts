import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteField,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { warmBookInsights } from 'api/app/book/cacheBookInsights';
import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { setGuestBookRead } from 'api/guest/guestStore';

export const useToggleBookReadMutation = () => {
  const queryClient = useQueryClient();
  const { isGuest } = useGuest();
  const userId = auth.currentUser?.uid;

  return useMutation({
    mutationFn: async ({
      bookId,
      isRead,
    }: {
      bookId: string;
      isRead: boolean;
    }) => {
      if (isGuest) {
        await setGuestBookRead(bookId, !isRead);
        return;
      }

      if (!userId) throw new Error('User not authenticated');

      // Unticking clears the read date, so ticking it again later records
      // the new one.
      await updateDoc(doc(db, 'users', userId, 'books', bookId), {
        isRead: !isRead,
        readAt: isRead ? deleteField() : serverTimestamp(),
      });

      // Get it ready for Insights while the reader carries on.
      if (!isRead) void warmBookInsights(bookId);
    },
    onMutate: async ({ bookId, isRead }) => {
      await queryClient.cancelQueries({ queryKey: ['userBooks'] });

      const previousData = queryClient.getQueriesData({
        queryKey: ['userBooks'],
      });

      // Optimistically update the cache
      queryClient.setQueriesData({ queryKey: ['userBooks'] }, (old: any) => {
        const pages = old.pages.map((page: any) => ({
          ...page,
          books: page.books.map((book: any) =>
            book.id === bookId
              ? {
                  ...book,
                  isRead: !isRead,
                  readAt: isRead ? undefined : Date.now(),
                }
              : book,
          ),
        }));
        return { ...old, pages };
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueriesData(
          { queryKey: ['userBooks'] },
          context.previousData,
        );
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['userBooks'] });
      void queryClient.invalidateQueries({ queryKey: ['readingInsights'] });
    },
  });
};
