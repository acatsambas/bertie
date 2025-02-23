import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserBooks } from 'api/app/hooks';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export const SECTIONS_IDS = {
  CURRENT: 'CURRENT',
  PAST: 'PAST',
};

interface LibraryPageProps
  extends StackNavigationProp<
    NavigationType,
    typeof Routes.LIBRARY_01_LIBRARY
  > {}

export const useLibrary = (user: FirebaseAuthTypes.User) => {
  const userBooks = useUserBooks({ withRefs: true });
  const { t } = useTranslation();
  const { navigate } = useNavigation<LibraryPageProps>();

  const books = useMemo(
    () =>
      userBooks.reduce(
        (acc, book) => {
          if (book.isRead) {
            acc[1].data.push(book);
          } else {
            acc[0].data.push(book);
          }
          return acc;
        },
        [
          {
            id: SECTIONS_IDS.CURRENT,
            title: t(translations.library.current),
            data: [],
          },
          {
            id: SECTIONS_IDS.PAST,
            title: t(translations.library.past),
            data: [],
          },
        ],
      ),
    [userBooks, t],
  );

  const handleOnPressBook = book => {
    navigate(Routes.LIBRARY_02_BOOK, {
      book,
    });
  };

  const handleAddBook = () => {
    navigate(Routes.LIBRARY_03_SEARCH);
  };

  const handleOnRead = async (bookId: string, isRead: boolean) => {
    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('books')
        .doc(bookId)
        .update({
          isRead: !isRead,
        });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    books,
    handleOnPressBook,
    handleAddBook,
    handleOnRead,
  };
};
