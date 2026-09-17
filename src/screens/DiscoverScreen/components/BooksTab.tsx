import { makeStyles } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import LoadingState from 'components/LoadingState/LoadingState';
import SearchBooks from 'components/SearchBooks';
import Text from 'components/Text';

import { useEssentialBooksQuery } from 'api/app/book';

import { translations } from 'locales/translations';

import { DesktopBooksTab } from './DesktopBooksTab';

/** Desktop browsers get a grid of covers; everywhere else keeps this list. */
export const BooksTab = () =>
  useIsDesktop() ? <DesktopBooksTab /> : <MobileBooksTab />;

const MobileBooksTab = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { data: books = [], isLoading, isError } = useEssentialBooksQuery();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text kind="paragraph" text={t(translations.discover.booksHeader)} />
      {isLoading ? (
        <LoadingState />
      ) : books.length > 0 ? (
        <SearchBooks books={books} />
      ) : (
        <View style={styles.emptyState}>
          <Text
            kind="description"
            text={t(
              isError
                ? translations.discover.booksError
                : translations.discover.noBooksYet,
            )}
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
