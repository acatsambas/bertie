import { makeStyles, useTheme } from '@rneui/themed';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  View,
} from 'react-native';

import BookTile, {
  TILE_COLUMN_GAP,
  TILE_ROW_GAP,
  TILE_SHADOW_PAD,
  tileGrid,
} from 'components/BookTile';
import { DESKTOP_PAGE_PADDING_TOP } from 'components/DesktopColumn';
import EmptyState from 'components/EmptyState';
import Text from 'components/Text';
import { translations } from 'locales/translations';

import { useLibrary } from '../hooks';
import { LibraryBook, LibraryFilter } from '../hooks/utils';
import { AddBookButton } from './AddBookButton';
import { LibraryShelfFilter } from './LibraryShelfFilter';

const RowGap = () => <View style={{ height: TILE_ROW_GAP }} />;

type GridRow = { id: string; books: LibraryBook[] };

const emptyCopy = (filter: LibraryFilter) =>
  filter === 'current'
    ? {
        title: translations.library.emptyCurrentTitle,
        description: translations.library.emptyCurrentDescription,
      }
    : {
        title: translations.library.emptyPastTitle,
        description: translations.library.emptyPastDescription,
      };

/** Pack books into tile rows. */
const toGridRows = (books: LibraryBook[], columns: number): GridRow[] => {
  const rows: GridRow[] = [];
  for (let i = 0; i < books.length; i += columns) {
    const chunk = books.slice(i, i + columns);
    rows.push({ id: `row-${i / columns}-${chunk[0].id}`, books: chunk });
  }
  return rows;
};

/**
 * My list on desktop: the same library, filter and actions as the mobile
 * screen, laid out as a grid of covers. The avatar that heads the mobile
 * screen lives in the side rail instead.
 */
export const DesktopLibrary = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<LibraryFilter>('current');
  const [gridWidth, setGridWidth] = useState(0);
  const {
    books,
    currentBooks,
    pastBooks,
    handleOnPressBook,
    handleOnRead,
    handleAddBook,
    fetchMoreBooks,
    hasNextPage,
    loading,
  } = useLibrary(filter);

  const { columns, tileWidth } = tileGrid(
    Math.max(0, gridWidth - TILE_SHADOW_PAD * 2),
  );
  const rows = useMemo(
    () => (columns > 0 ? toGridRows(books, columns) : []),
    [books, columns],
  );

  // Only once the visible shelf has fully loaded — mid-paging it would
  // undercount.
  const showCount = !hasNextPage && books.length > 0;
  const countText = (() => {
    if (filter === 'current') {
      const count = currentBooks.length;
      return t(
        count === 1
          ? translations.library.currentCountOne
          : translations.library.currentCountOther,
        { count },
      );
    }
    const count = pastBooks.length;
    return t(
      count === 1
        ? translations.library.pastCountOne
        : translations.library.pastCountOther,
      { count },
    );
  })();

  const handleGridLayout = (event: LayoutChangeEvent) =>
    setGridWidth(event.nativeEvent.layout.width);

  const renderEmpty = () => {
    if (loading) return null;

    const copy = emptyCopy(filter);
    return (
      <EmptyState
        variant="list"
        title={t(copy.title)}
        description={t(copy.description)}
        icon="myList"
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text kind="bigHeader" text={t(translations.library.title)} />
        <View style={styles.headerActions}>
          <AddBookButton onPress={handleAddBook} />
          <LibraryShelfFilter value={filter} onChange={setFilter} />
        </View>
      </View>
      <View style={styles.toolbar}>
        {showCount && (
          <Text kind="littleText" text={countText} color={theme.colors.grey2} />
        )}
      </View>
      <View style={styles.grid} onLayout={handleGridLayout}>
        {gridWidth > 0 && (
          <FlatList
            data={rows}
            keyExtractor={(row: GridRow) => row.id}
            removeClippedSubviews={false}
            style={styles.list}
            renderItem={({ item: row }) => {
              return (
                <View style={styles.row}>
                  {row.books.map(book => (
                    <BookTile
                      key={book.id}
                      bookId={book.id}
                      title={book.volumeInfo?.title}
                      author={book.volumeInfo?.authors?.join?.(', ')}
                      width={tileWidth}
                      muted={!!book.isRead}
                      onPress={() => handleOnPressBook(book)}
                      toggle={{
                        checked: !!book.isRead,
                        icon: book.isRead
                          ? 'checkbox-marked'
                          : 'checkbox-blank-outline',
                        color: book.isRead
                          ? theme.colors.primary
                          : theme.colors.secondary,
                        label: book.volumeInfo?.title ?? '',
                        onPress: () => handleOnRead(book.id, !!book.isRead),
                      }}
                    />
                  ))}
                </View>
              );
            }}
            ItemSeparatorComponent={RowGap}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            onEndReached={fetchMoreBooks}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? <ActivityIndicator style={styles.loading} /> : null
            }
          />
        )}
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    paddingTop: DESKTOP_PAGE_PADDING_TOP,
    backgroundColor: theme.colors.white,
    overflow: 'visible',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  grid: { flex: 1, overflow: 'visible' },
  list: { overflow: 'visible' },
  gridContent: {
    paddingBottom: 40,
    paddingHorizontal: TILE_SHADOW_PAD,
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
    gap: TILE_COLUMN_GAP,
    overflow: 'visible',
  },
  loading: { paddingTop: 20 },
}));

export default DesktopLibrary;
