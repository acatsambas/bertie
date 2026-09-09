import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useMemo } from 'react';

import { useToggleBookReadMutation, useUserBooksQuery } from 'api/app/book';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { categorizeBooks } from './utils';

interface LibraryPageProps
  extends StackNavigationProp<
    NavigationType,
    typeof Routes.LIBRARY_01_LIBRARY
  > {}

export const useLibrary = () => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useUserBooksQuery({
    withRefs: true,
  });
  const { mutate: toggleRead } = useToggleBookReadMutation();
  const { navigate } = useNavigation<LibraryPageProps>();

  const { current, past } = useMemo(() => categorizeBooks(data), [data]);

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
