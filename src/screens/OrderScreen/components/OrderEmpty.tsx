import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import {
  useAddBookToLibraryMutation,
  useBooksQuery,
  useUserBooksIdsQuery,
} from 'api/app/book';
import { BookResult } from 'api/google-books/search';
import Book from 'components/Book';
import EmptyState from 'components/EmptyState';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

const DISCOVER_RECOMMENDED_IDS = [
  'MSurBex2xcUC',
  'Nn-WDwAAQBAJ',
  'fn20CwAAQBAJ',
  'n5orAQAAMAAJ',
  'olyPEAAAQBAJ',
];
const NON_DISCOVER_RECOMMENDED_IDS = [
  '2akU-k9xIQ0C',
  'TEETEQAAQBAJ',
  '4WcFyY8ZEgkC',
  'OPy6E5ZhXs0C',
  '11TmzzQw7p0C',
];

interface OrderEmptyProps {
  kind?: 'discover' | 'order';
}

export const OrderEmpty = ({ kind = 'order' }: OrderEmptyProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { navigate } = useNavigation<StackNavigationProp<NavigationType>>();
  const { data: userBooksIds = [] } = useUserBooksIdsQuery();
  const { mutate: addBook } = useAddBookToLibraryMutation();

  const recommendedIds =
    kind === 'discover'
      ? DISCOVER_RECOMMENDED_IDS
      : NON_DISCOVER_RECOMMENDED_IDS;
  const { data: recommendedBooks = [] } = useBooksQuery({
    ids: recommendedIds,
  });

  const navigateToBook = (book: BookResult) =>
    navigate(Routes.ROOT_06_BOOK, { bookId: book.id });

  const handleAddBook = async (book: BookResult) => {
    const isUserBook = userBooksIds.some(({ id }) => id === book.id);
    addBook({ book, isUserBook });
  };

  return (
    <EmptyState
      variant="list"
      icon="myList"
      title={t(translations.order.headerNoBooks)}
      description={t(translations.order.suggestions)}
      style={styles.container}
    >
      <View>
        {recommendedBooks.map(book => (
          <Book
            key={book.id}
            isChecked={userBooksIds.some(({ id }) => id === book.id)}
            kind="search"
            title={book.volumeInfo?.title}
            author={book.volumeInfo?.authors?.join?.(', ')}
            onPress={() => navigateToBook(book)}
            onChange={() => handleAddBook(book)}
          />
        ))}
      </View>
    </EmptyState>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    paddingBottom: 120,
  },
}));
