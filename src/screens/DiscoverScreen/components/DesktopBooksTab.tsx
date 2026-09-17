import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles, useTheme } from '@rneui/themed';
import { useAuthGate } from 'hooks/useAuthGate';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, ScrollView, View } from 'react-native';

import AuthGateModal from 'components/AuthGateModal';
import BookTile, {
  TILE_COLUMN_GAP,
  TILE_ROW_GAP,
  tileGrid,
} from 'components/BookTile';
import LoadingState from 'components/LoadingState/LoadingState';
import Text from 'components/Text';

import {
  useAddBookToLibraryMutation,
  useEssentialBooksQuery,
  useUserBooksIdsQuery,
} from 'api/app/book';
import { BookResult } from 'api/google-books/search';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

// The tick colour the mobile list uses for books already on your list.
const IN_LIST_COLOR = '#38AD59';

/**
 * Discover's essential reads on desktop: the same books and the same
 * add-to-list control as the mobile list, as a grid of covers.
 */
export const DesktopBooksTab = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { navigate } = useNavigation<StackNavigationProp<NavigationType>>();
  const [gridWidth, setGridWidth] = useState(0);
  const { data: books = [], isLoading, isError } = useEssentialBooksQuery();
  const { data: userBooksIds = [] } = useUserBooksIdsQuery();
  const { mutate: addBook } = useAddBookToLibraryMutation();
  const {
    isGuest,
    requireAuth,
    gateVisible,
    gateMessage,
    dismissGate,
    confirmGate,
  } = useAuthGate();

  const { tileWidth } = tileGrid(gridWidth);

  // The same rules SearchBooks applies to this list on mobile.
  const handleToggle = (book: BookResult, inList: boolean) => {
    if (!inList && isGuest && userBooksIds.length >= 3) {
      requireAuth(t(translations.authGate.bookLimit));
      return;
    }
    addBook({ book, isUserBook: inList });
  };

  const handleGridLayout = (event: LayoutChangeEvent) =>
    setGridWidth(event.nativeEvent.layout.width);

  const renderBooks = () => {
    if (isLoading) return <LoadingState />;

    if (books.length === 0) {
      return (
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
      );
    }

    return (
      <View style={styles.grid} onLayout={handleGridLayout}>
        {gridWidth > 0 &&
          books.map(book => {
            const inList = userBooksIds.some(({ id }) => id === book.id);

            return (
              <BookTile
                key={book.id}
                bookId={book.id}
                title={book.volumeInfo?.title}
                author={book.volumeInfo?.authors?.join?.(', ')}
                width={tileWidth}
                onPress={() =>
                  navigate(Routes.ROOT_06_BOOK, { bookId: book.id })
                }
                toggle={{
                  checked: inList,
                  icon: inList ? 'check-circle' : 'plus-circle-outline',
                  color: inList ? IN_LIST_COLOR : theme.colors.secondary,
                  label: t(translations.library.add),
                  onPress: () => handleToggle(book, inList),
                }}
              />
            );
          })}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text
        kind="paragraph"
        text={t(translations.discover.booksHeader)}
        style={styles.intro}
      />
      {renderBooks()}
      <AuthGateModal
        visible={gateVisible}
        message={gateMessage}
        onDismiss={dismissGate}
        onSignUp={confirmGate}
      />
    </ScrollView>
  );
};

const useStyles = makeStyles(() => ({
  container: { flex: 1 },
  content: {
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  intro: { maxWidth: 640 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: TILE_COLUMN_GAP,
    rowGap: TILE_ROW_GAP,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 20,
  },
}));

export default DesktopBooksTab;
