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
import Text from 'components/Text';
import { translations } from 'locales/translations';

import { useLibrary } from '../hooks';
import { LibraryBook, LibraryFilter, LibraryListItem } from '../hooks/utils';
import { AddBookButton } from './AddBookButton';
import { LibraryShelfFilter } from './LibraryShelfFilter';

const RowGap = () => <View style={{ height: TILE_ROW_GAP }} />;

type GridRow =
  | { type: 'section'; id: string; shelf: 'current' | 'past' }
  | { type: 'books'; id: string; books: LibraryBook[] };

const emptyKey = (filter: LibraryFilter) => {
  if (filter === 'current') return translations.library.emptyCurrent;
  if (filter === 'past') return translations.library.emptyPast;
  return translations.library.emptyBoth;
};

const sectionLabel = (shelf: 'current' | 'past') =>
  shelf === 'current'
    ? translations.library.current
    : translations.library.past;

/** Pack list items into full-width section labels and tile rows. */
const toGridRows = (items: LibraryListItem[], columns: number): GridRow[] => {
  const rows: GridRow[] = [];
  let pending: LibraryBook[] = [];
  let rowIndex = 0;

  const flush = () => {
    while (pending.length > 0) {
      const chunk = pending.splice(0, columns);
      rows.push({
        type: 'books',
        id: `row-${rowIndex++}-${chunk[0]?.id ?? 'empty'}`,
        books: chunk,
      });
    }
  };

  for (const item of items) {
    if (item.type === 'section') {
      flush();
      rows.push({ type: 'section', id: item.id, shelf: item.shelf });
      continue;
    }
    pending.push(item.book);
  }
  flush();
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
  const [filter, setFilter] = useState<LibraryFilter>('both');
  const [gridWidth, setGridWidth] = useState(0);
  const {
    items,
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
    () => (columns > 0 ? toGridRows(items, columns) : []),
    [items, columns],
  );

  // Only once the visible shelf/shelves have fully loaded — mid-paging it
  // would undercount.
  const showCount = !hasNextPage && items.some(item => item.type === 'book');
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
    if (filter === 'past') {
      const count = pastBooks.length;
      return t(
        count === 1
          ? translations.library.pastCountOne
          : translations.library.pastCountOther,
        { count },
      );
    }
    return t(translations.library.bothCount, {
      current: currentBooks.length,
      past: pastBooks.length,
    });
  })();

  const handleGridLayout = (event: LayoutChangeEvent) =>
    setGridWidth(event.nativeEvent.layout.width);

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <Text kind="paragraph" text={t(emptyKey(filter))} style={styles.empty} />
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
              if (row.type === 'section') {
                return (
                  <Text
                    kind="description"
                    text={t(sectionLabel(row.shelf))}
                    color={theme.colors.grey2}
                    style={styles.section}
                  />
                );
              }

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
                        onPress: () => handleOnRead(book.id, book.isRead),
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
  section: {
    fontFamily: 'Commissioner_600SemiBold',
    paddingBottom: 4,
  },
  loading: { paddingTop: 20 },
  empty: {
    paddingTop: 40,
    textAlign: 'center',
  },
}));

export default DesktopLibrary;
