import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useMemo } from 'react';

import { useToggleBookReadMutation, useUserBooksQuery } from 'api/app/book';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { LibraryBook, LibraryFilter, categorizeBooks } from './utils';

interface LibraryPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.LIBRARY_01_LIBRARY
> {}

/**
 * Someone's list for My list. Current and Past are fetched as separate
 * shelves so a long Past can't crowd Current out of the first page; `filter`
 * chooses which of those shelves the screen shows.
 */
export const useLibrary = (filter: LibraryFilter) => {
  const currentQuery = useUserBooksQuery({ withRefs: true, shelf: 'current' });
  const pastQuery = useUserBooksQuery({ withRefs: true, shelf: 'past' });
  const { mutate: toggleRead } = useToggleBookReadMutation();
  const { navigate } = useNavigation<LibraryPageProps>();

  // Sorted across both shelves, so a book ticked in Current moves to Past
  // straight away rather than once the refetch lands.
  const { current, past } = useMemo(
    () => categorizeBooks(currentQuery.data, pastQuery.data),
    [currentQuery.data, pastQuery.data],
  );

  const books = filter === 'current' ? current : past;
  const shelfQuery = filter === 'current' ? currentQuery : pastQuery;
  const hasNextPage = !!shelfQuery.hasNextPage;
  const loading = shelfQuery.isFetching;

  const fetchMoreBooks = useCallback(() => {
    if (shelfQuery.hasNextPage && !shelfQuery.isFetching) {
      void shelfQuery.fetchNextPage();
    }
  }, [shelfQuery]);

  return {
    books,
    currentBooks: current,
    pastBooks: past,
    handleOnPressBook: (book: LibraryBook) =>
      navigate(Routes.ROOT_06_BOOK, { bookId: book.id }),
    handleAddBook: () => navigate(Routes.LIBRARY_03_SEARCH),
    handleOnRead: async (bookId: string, isRead: boolean) =>
      toggleRead({ bookId, isRead }),
    fetchMoreBooks,
    hasNextPage,
    loading,
  };
};
