import { makeStyles } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { useEssentialBooksQuery } from 'api/app/book';
import EmptyState from 'components/EmptyState';
import LoadingState from 'components/LoadingState/LoadingState';
import SearchBooks from 'components/SearchBooks';
import Text from 'components/Text';
import { translations } from 'locales/translations';

import { DesktopBooksTab } from './DesktopBooksTab';

/** Desktop browsers get a grid of covers; everywhere else keeps this list. */
export const BooksTab = () =>
  useIsDesktop() ? <DesktopBooksTab /> : <MobileBooksTab />;

const MobileBooksTab = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { data: books = [], isLoading, isError } = useEssentialBooksQuery();
  const hasBooks = books.length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <LoadingState />
      ) : hasBooks ? (
        <>
          <Text kind="paragraph" text={t(translations.discover.booksHeader)} />
          <SearchBooks books={books} />
        </>
      ) : (
        <EmptyState
          variant="list"
          icon="book"
          title={t(
            isError
              ? translations.discover.booksErrorTitle
              : translations.discover.noBooksYetTitle,
          )}
          description={t(
            isError
              ? translations.discover.booksErrorDescription
              : translations.discover.noBooksYetDescription,
          )}
        />
      )}
    </ScrollView>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
  },
}));
