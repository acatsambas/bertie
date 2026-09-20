import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useMemo } from 'react';

import {
  Shelf,
  useToggleBookReadMutation,
  useUserBooksQuery,
} from 'api/app/book';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { categorizeBooks } from './utils';

interface LibraryPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.LIBRARY_01_LIBRARY
> {}

/**
 * Someone's list for the Library tabs. Each tab pages through its own shelf,
 * so a long Past can't crowd Current out of the first page; `shelf` is the
 * tab on show, which the load-more and loading state belong to.
 */
export const useLibrary = (shelf: Shelf) => {
  const currentQuery = useUserBooksQuery({ withRefs: true, shelf: 'current' });
  const pastQuery = useUserBooksQuery({ withRefs: true, shelf: 'past' });
  const { fetchNextPage, hasNextPage, isFetching } =
    shelf === 'current' ? currentQuery : pastQuery;
  const { mutate: toggleRead } = useToggleBookReadMutation();
  const { navigate } = useNavigation<LibraryPageProps>();

  // Sorted into tabs across both shelves, so a book ticked in Current moves
  // to Past straight away rather than once the refetch lands.
  const { current, past } = useMemo(
    () => categorizeBooks(currentQuery.data, pastQuery.data),
    [currentQuery.data, pastQuery.data],
  );

  const fetchMoreBooks = useCallback(() => {
    if (hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  return {
    currentBooks: current,
    pastBooks: past,
    handleOnPressBook: book =>
      navigate(Routes.ROOT_06_BOOK, { bookId: book.id }),
    handleAddBook: () => navigate(Routes.LIBRARY_03_SEARCH),
    handleOnRead: async (bookId: string, isRead: boolean) =>
      toggleRead({ bookId, isRead }),
    fetchMoreBooks,
    hasNextPage,
    loading: isFetching,
  };
};
