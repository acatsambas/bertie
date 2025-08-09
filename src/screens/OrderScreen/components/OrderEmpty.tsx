import { useNavigation } from '@react-navigation/native';
import { makeStyles } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Book from 'components/Book';
import Text from 'components/Text';

import { useAddBookMutation, useUserBooksIdsQuery } from 'api/app/book';
import { useBooks } from 'api/app/hooks';

import { translations } from 'locales/translations';

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
  const { navigate } = useNavigation<any>();
  const { data: userBooksIds = [] } = useUserBooksIdsQuery();
  const { mutate: addBook } = useAddBookMutation();

  const recommendedIds =
    kind === 'discover'
      ? DISCOVER_RECOMMENDED_IDS
      : NON_DISCOVER_RECOMMENDED_IDS;
  const recommendedBooks = useBooks({ ids: recommendedIds });

  const navigateToBook = book =>
    navigate('LibraryNavigator', {
      screen: 'Book',
      params: { book },
    });

  const handleAddBook = async book => {
    const isUserBook = userBooksIds.some(({ id }) => id === book.id);
    addBook({ book, isUserBook });
  };

  return (
    <View style={styles.container}>
      <Text text={t(translations.order.headerNoBooks)} kind="header" />
      <Text text={t(translations.order.suggestions)} kind="paragraph" />
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
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 20,
    paddingBottom: 120,
    gap: 20,
    position: 'relative',
  },
}));
