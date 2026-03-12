import React from 'react';
import { ScrollView, View } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';

import Text from 'components/Text';
import SearchBooks from 'components/SearchBooks';
import LoadingState from 'components/LoadingState/LoadingState';

import { useEssentialBooksQuery, useBooksQuery } from 'api/app/book';

import { translations } from 'locales/translations';

export const BooksTab = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { data: essentialBookIds = [], isLoading: isLoadingIds } =
    useEssentialBooksQuery();
  const { data: books = [], isLoading: isLoadingBooks } = useBooksQuery({
    ids: essentialBookIds,
  });

  const isLoading = isLoadingIds || isLoadingBooks;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text
        kind="paragraph"
        text={t(translations.discover.booksHeader)}
      />
      {isLoading ? (
        <LoadingState />
      ) : books.length > 0 ? (
        <SearchBooks books={books} />
      ) : (
        <View style={styles.emptyState}>
          <Text
            kind="description"
            text="No essential reads yet. Be the first to rate a book!"
          />
        </View>
      )}
    </ScrollView>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 20,
    gap: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 20,
  },
}));
