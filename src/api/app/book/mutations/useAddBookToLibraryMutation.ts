import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { bookQueryKeys } from 'api/app/book/queryKeys';
import { UserBook, UserBookId } from 'api/app/types';
import { auth, db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';
import { useGuest } from 'api/guest/GuestProvider';
import { setGuestBook } from 'api/guest/guestStore';

type UserBooksPage = {
  books: (UserBook & Partial<BookResult>)[];
  entries: UserBook[];
  nextOffset: number | null;
};

type UserBooksData = InfiniteData<UserBooksPage>;

const isPastShelf = (queryKey: readonly unknown[]) => queryKey[3] === 'past';

export const useAddBookToLibraryMutation = () => {
  const queryClient = useQueryClient();
  const { isGuest } = useGuest();
  const userId = auth.currentUser?.uid;

  return useMutation({
    mutationFn: async ({
      book,
      isUserBook,
    }: {
      book: BookResult;
      isUserBook: boolean;
    }) => {
      if (isGuest) {
        await setGuestBook(book, isUserBook);
        return;
      }

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
        await setDoc(userBookRef, { bookRef, addedAt: serverTimestamp() });
      }
    },
    onMutate: async ({ book, isUserBook }) => {
      const idsKey = bookQueryKeys.userBooksIds(isGuest);

      // cancelQueries matches on prefix, so the bare key covers both variants
      await queryClient.cancelQueries({ queryKey: ['userBooksIds'] });
      await queryClient.cancelQueries({ queryKey: ['userBooks'] });

      const previousIds = queryClient.getQueryData<UserBookId[]>(idsKey);
      const previousBooks = queryClient.getQueriesData<UserBooksData>({
        queryKey: ['userBooks'],
      });

      queryClient.setQueryData(idsKey, (old: UserBookId[] = []) => {
        if (isUserBook) {
          return old.filter(item => item.id !== book.id);
        }
        return [...old, { id: book.id }];
      });

      for (const [queryKey, data] of previousBooks) {
        if (!data?.pages) continue;

        if (isUserBook) {
          queryClient.setQueryData<UserBooksData>(queryKey, {
            ...data,
            pages: data.pages.map(page => ({
              ...page,
              books: page.books.filter(item => item.id !== book.id),
              entries: page.entries.filter(item => item.id !== book.id),
            })),
          });
          continue;
        }

        if (isPastShelf(queryKey)) continue;
        if (
          data.pages.some(page => page.books.some(item => item.id === book.id))
        ) {
          continue;
        }

        const addedAt = Date.now();
        const entry: UserBook = {
          id: book.id,
          bookRef: doc(db, 'books', book.id),
          isRead: false,
          addedAt,
        };

        queryClient.setQueryData<UserBooksData>(queryKey, {
          ...data,
          pages: data.pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  books: [{ ...entry, ...book }, ...page.books],
                  entries: page.entries.length
                    ? [entry, ...page.entries]
                    : page.entries,
                }
              : page,
          ),
        });
      }

      return { previousIds, previousBooks };
    },
    onError: (_, __, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(
          bookQueryKeys.userBooksIds(isGuest),
          context.previousIds,
        );
      }
      if (context?.previousBooks) {
        for (const [queryKey, data] of context.previousBooks) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['userBooksIds'] });
      void queryClient.invalidateQueries({ queryKey: ['userBooks'] });
      void queryClient.invalidateQueries({ queryKey: ['readingInsights'] });
    },
  });
};
