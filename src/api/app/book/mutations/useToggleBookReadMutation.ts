import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';

export const useToggleBookReadMutation = () => {
  const queryClient = useQueryClient();
  const userId = auth.currentUser?.uid;

  return useMutation({
    mutationFn: async ({
      bookId,
      isRead,
    }: {
      bookId: string;
      isRead: boolean;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      await updateDoc(doc(db, 'users', userId, 'books', bookId), {
        isRead: !isRead,
      });
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
            book.id === bookId ? { ...book, isRead: !isRead } : book,
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
    },
  });
};
