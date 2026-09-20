import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useMemo } from 'react';

import { useToggleBookReadMutation, useUserBooksQuery } from 'api/app/book';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { LibraryFilter, buildLibraryList, categorizeBooks } from './utils';

interface LibraryPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.LIBRARY_01_LIBRARY
> {}

/**
 * Someone's list for My list. Current and Past are fetched as separate
 * shelves so a long Past can't crowd Current out of the first page; `filter`
 * chooses which of those shelves the screen shows (or both).
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

  const items = useMemo(
    () => buildLibraryList(filter, current, past),
    [filter, current, past],
  );

  const hasNextPage =
    filter === 'current'
      ? !!currentQuery.hasNextPage
      : filter === 'past'
        ? !!pastQuery.hasNextPage
        : !!currentQuery.hasNextPage || !!pastQuery.hasNextPage;

  const loading =
    filter === 'current'
      ? currentQuery.isFetching
      : filter === 'past'
        ? pastQuery.isFetching
        : currentQuery.isFetching || pastQuery.isFetching;

  const fetchMoreBooks = useCallback(() => {
    if (filter === 'current') {
      if (currentQuery.hasNextPage && !currentQuery.isFetching) {
        void currentQuery.fetchNextPage();
      }
      return;
    }
    if (filter === 'past') {
      if (pastQuery.hasNextPage && !pastQuery.isFetching) {
        void pastQuery.fetchNextPage();
      }
      return;
    }
    // Both: finish paging Current before Past so the list grows in the
    // same order it is shown (Current first, then Past).
    if (currentQuery.hasNextPage && !currentQuery.isFetching) {
      void currentQuery.fetchNextPage();
    } else if (pastQuery.hasNextPage && !pastQuery.isFetching) {
      void pastQuery.fetchNextPage();
    }
  }, [filter, currentQuery, pastQuery]);

  return {
    items,
    currentBooks: current,
    pastBooks: past,
    handleOnPressBook: book =>
      navigate(Routes.ROOT_06_BOOK, { bookId: book.id }),
    handleAddBook: () => navigate(Routes.LIBRARY_03_SEARCH),
    handleOnRead: async (bookId: string, isRead: boolean) =>
      toggleRead({ bookId, isRead }),
    fetchMoreBooks,
    hasNextPage,
    loading,
  };
};
