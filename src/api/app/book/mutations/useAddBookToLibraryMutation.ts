import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

import { UserBookId } from 'api/app/types';
import { auth, db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';

export const useAddBookToLibraryMutation = () => {
  const queryClient = useQueryClient();
  const userId = auth.currentUser?.uid;

  return useMutation({
    mutationFn: async ({
      book,
      isUserBook,
    }: {
      book: BookResult;
      isUserBook: boolean;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      const bookRef = doc(db, 'books', book.id);

      if (!isUserBook) {
        const bookDoc = await getDoc(bookRef);
        if (!bookDoc.exists()) {
          await setDoc(bookRef, book);
        }
      }

      const userBookRef = doc(db, 'users', userId, 'books', book.id);

      if (isUserBook) {
        await deleteDoc(userBookRef);
      } else {
        await setDoc(userBookRef, { bookRef });
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
