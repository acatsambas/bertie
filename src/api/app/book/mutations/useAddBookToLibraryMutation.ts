import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserBookId } from 'api/app/types';
import { BookResult } from 'api/google-books/search';

export const useAddBookToLibraryMutation = () => {
  const queryClient = useQueryClient();
  const userId = auth().currentUser?.uid;

  return useMutation({
    mutationFn: async ({
      book,
      isUserBook,
    }: {
      book: BookResult;
      isUserBook: boolean;
    }) => {
      const bookRef = firestore().collection('books').doc(book.id);

      if (!isUserBook && !(await bookRef.get()).exists) {
        await firestore().collection('books').doc(book.id).set(book);
      }

      const userBookRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('books')
        .doc(book.id);

      if (isUserBook) {
        await userBookRef.delete();
      } else {
        await userBookRef.set({ bookRef });
      }
    },
    onMutate: async ({ book, isUserBook }) => {
      await queryClient.cancelQueries({ queryKey: ['userBooksIds'] });
      const previousData = queryClient.getQueryData(['userBooksIds']);

      queryClient.setQueryData(['userBooksIds'], (old: UserBookId[] = []) => {
        if (isUserBook) {
          return old.filter(item => item.id !== book.id);
        }
        return [...old, { id: book.id }];
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['userBooksIds'], context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['userBooksIds'] });
      void queryClient.invalidateQueries({ queryKey: ['userBooks'] });
    },
  });
};
