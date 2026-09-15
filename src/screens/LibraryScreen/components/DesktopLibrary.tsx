import { makeStyles, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  Pressable,
  View,
} from 'react-native';

import BookTile, {
  TILE_COLUMN_GAP,
  TILE_ROW_GAP,
  tileGrid,
} from 'components/BookTile';
import Icon from 'components/Icon';
import Text from 'components/Text';

import { translations } from 'locales/translations';

import { useLibrary } from '../hooks';
import { LibraryBook } from '../hooks/utils';

const CURRENT_TAB = 0;
const PAST_TAB = 1;

const RowGap = () => <View style={{ height: TILE_ROW_GAP }} />;

/**
 * My list on desktop: the same library, tabs and actions as the mobile
 * screen, laid out as a grid of covers. The avatar that heads the mobile
 * screen lives in the side rail instead.
 */
export const DesktopLibrary = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [tab, setTab] = useState(CURRENT_TAB);
  const [gridWidth, setGridWidth] = useState(0);
  const {
    currentBooks,
    pastBooks,
    handleOnPressBook,
    handleOnRead,
    handleAddBook,
    fetchMoreBooks,
    hasNextPage,
    loading,
  } = useLibrary(tab === CURRENT_TAB ? 'current' : 'past');

  const isCurrent = tab === CURRENT_TAB;
  const books = isCurrent ? currentBooks : pastBooks;

  const { columns, tileWidth } = tileGrid(gridWidth);

  // Only once this tab has fully loaded — mid-paging it would undercount.
  const count = books.length;
  const showCount = !hasNextPage && count > 0;
  const countText = isCurrent
    ? t(
        count === 1
          ? translations.library.currentCountOne
          : translations.library.currentCountOther,
        { count },
      )
    : t(
        count === 1
          ? translations.library.pastCountOne
          : translations.library.pastCountOther,
        { count },
      );

  const handleGridLayout = (event: LayoutChangeEvent) =>
    setGridWidth(event.nativeEvent.layout.width);

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <Text
        kind="paragraph"
        text={t(
          isCurrent
            ? translations.library.emptyCurrent
            : translations.library.emptyPast,
        )}
        style={styles.empty}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text kind="bigHeader" text={t(translations.library.title)} />
        <View style={styles.segmented} accessibilityRole="tablist">
          {[CURRENT_TAB, PAST_TAB].map(value => {
            const selected = value === tab;

            return (
              <Pressable
                key={value}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setTab(value)}
                style={[styles.segment, selected && styles.segmentSelected]}
              >
                <Text
                  kind="description"
                  text={t(
                    value === CURRENT_TAB
                      ? translations.library.current
                      : translations.library.past,
                  )}
                  color={selected ? theme.colors.secondary : theme.colors.grey2}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.toolbar}>
        <View>
          {showCount && (
            <Text
              kind="description"
              text={countText}
              color={theme.colors.grey2}
            />
          )}
        </View>
        {/* Like the mobile "Search for a book" row, this only heads the
            Current tab: a book you add starts out unread. */}
        {isCurrent && (
          <Pressable
            accessibilityRole="button"
            onPress={handleAddBook}
            style={state => [
              styles.addButton,
              (state as { hovered?: boolean }).hovered &&
                styles.addButtonHovered,
            ]}
          >
            <Icon icon="plus" color={theme.colors.white} size={18} />
            <Text
              kind="description"
              text={t(translations.library.addBook)}
              color={theme.colors.white}
              style={styles.addButtonLabel}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.grid} onLayout={handleGridLayout}>
        {gridWidth > 0 && (
          <FlatList
            // FlatList can't change numColumns in place, so remount when the
            // window resizes across a column boundary.
            key={columns}
            data={books}
            numColumns={columns}
            keyExtractor={(item: LibraryBook) => item.id}
            renderItem={({ item }) => (
              <BookTile
                bookId={item.id}
                title={item.volumeInfo?.title}
                author={item.volumeInfo?.authors?.join?.(', ')}
                width={tileWidth}
                onPress={() => handleOnPressBook(item)}
                toggle={{
                  checked: !!item.isRead,
                  icon: item.isRead
                    ? 'checkbox-marked'
                    : 'checkbox-blank-outline',
                  color: item.isRead
                    ? theme.colors.primary
                    : theme.colors.secondary,
                  label: item.volumeInfo?.title ?? '',
                  onPress: () => handleOnRead(item.id, item.isRead),
                }}
              />
            )}
            columnWrapperStyle={styles.row}
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
    paddingTop: 36,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  segmented: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 8,
    backgroundColor: theme.colors.grey0,
  },
  segment: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 6,
  },
  segmentSelected: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  addButtonHovered: { opacity: 0.9 },
  addButtonLabel: { fontFamily: 'Commissioner_600SemiBold' },
  grid: { flex: 1 },
  gridContent: { paddingBottom: 40 },
  row: { gap: TILE_COLUMN_GAP },
  loading: { paddingTop: 20 },
  empty: {
    paddingTop: 40,
    textAlign: 'center',
  },
}));

export default DesktopLibrary;
