import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useToggleBookReadMutation = () => {
  const queryClient = useQueryClient();
  const userId = auth().currentUser?.uid;

  return useMutation({
    mutationFn: async ({
      bookId,
      isRead,
    }: {
      bookId: string;
      isRead: boolean;
    }) => {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('books')
        .doc(bookId)
        .update({
          isRead: !isRead,
        });
    },
    onMutate: async ({ bookId, isRead }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['userBooks'] });

      // Snapshot the previous value
      const previousData = queryClient.getQueriesData({
        queryKey: ['userBooks'],
      });

      // Optimistically update the cache
      queryClient.setQueriesData({ queryKey: ['userBooks'] }, (old: any) => {
        const pages = old.pages.map(page => ({
          ...page,
          books: page.books.map(book =>
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
