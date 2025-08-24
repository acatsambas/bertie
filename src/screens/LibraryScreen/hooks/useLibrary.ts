import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useToggleBookReadMutation, useUserBooksQuery } from 'api/app/book';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { categorizeBooks } from './utils';

interface LibraryPageProps
  extends StackNavigationProp<
    NavigationType,
    typeof Routes.LIBRARY_01_LIBRARY
  > {}

export const useLibrary = (user: FirebaseAuthTypes.User) => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useUserBooksQuery({
    withRefs: true,
  });
  const { mutate: toggleRead } = useToggleBookReadMutation();
  const { t } = useTranslation();
  const { navigate } = useNavigation<LibraryPageProps>();

  const books = useMemo(() => {
    if (!data) return [];
    return categorizeBooks(data, t);
  }, [data, t]);

  const fetchMoreBooks = useCallback(() => {
    if (hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  return {
    books,
    handleOnPressBook: book => navigate(Routes.LIBRARY_02_BOOK, { book }),
    handleAddBook: () => navigate(Routes.LIBRARY_03_SEARCH),
    handleOnRead: async (bookId: string, isRead: boolean) =>
      toggleRead({ bookId, isRead }),
    fetchMoreBooks,
    loading: isFetching,
  };
};
