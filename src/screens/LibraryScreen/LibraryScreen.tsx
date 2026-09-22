import { LegendList, LegendListRenderItemProps } from '@legendapp/list';
import { makeStyles, useTheme } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Book from 'components/Book';
import EmptyState from 'components/EmptyState';
import Text from 'components/Text';
import { translations } from 'locales/translations';

import {
  AddBookButton,
  DesktopLibrary,
  LibraryShelfFilter,
  ListHeader,
} from './components';
import { useLibrary } from './hooks';
import { LibraryFilter, LibraryListItem } from './hooks/utils';

/** Desktop browsers get the cover grid; everywhere else keeps this list. */
export const LibraryScreen = () =>
  useIsDesktop() ? <DesktopLibrary /> : <MobileLibraryScreen />;

const emptyCopy = (filter: LibraryFilter) => {
  if (filter === 'current') {
    return {
      title: translations.library.emptyCurrentTitle,
      description: translations.library.emptyCurrentDescription,
    };
  }
  if (filter === 'past') {
    return {
      title: translations.library.emptyPastTitle,
      description: translations.library.emptyPastDescription,
    };
  }
  return {
    title: translations.library.emptyBothTitle,
    description: translations.library.emptyBothDescription,
  };
};

const sectionLabel = (shelf: 'current' | 'past') =>
  shelf === 'current'
    ? translations.library.current
    : translations.library.past;

const MobileLibraryScreen = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<LibraryFilter>('both');
  const {
    items,
    handleOnPressBook,
    handleOnRead,
    handleAddBook,
    fetchMoreBooks,
    loading,
  } = useLibrary(filter);

  const renderItem = ({ item }: LegendListRenderItemProps<LibraryListItem>) => {
    if (item.type === 'section') {
      return (
        <Text
          kind="description"
          text={t(sectionLabel(item.shelf))}
          color={theme.colors.grey2}
          style={styles.section}
        />
      );
    }

    const book = item.book;
    return (
      <Book
        title={book.volumeInfo?.title}
        author={book.volumeInfo?.authors?.join?.(', ')}
        kind="library"
        isChecked={book.isRead}
        onPress={() => handleOnPressBook(book)}
        onChange={() => handleOnRead(book.id, !!book.isRead)}
      />
    );
  };

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
    <SafeAreaView edges={['left', 'right', 'top']} style={styles.safeAreaView}>
      <View style={styles.container}>
        <ListHeader />
        <View style={styles.toolbar}>
          <AddBookButton onPress={handleAddBook} style={styles.search} />
          <LibraryShelfFilter value={filter} onChange={setFilter} />
        </View>
        <LegendList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item: LibraryListItem) => item.id}
          estimatedItemSize={70}
          initialContainerPoolRatio={2}
          ListEmptyComponent={renderEmpty}
          onEndReached={fetchMoreBooks}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator /> : <View />}
          recycleItems={true}
          maintainVisibleContentPosition
        />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  search: {
    flex: 1,
  },
  list: { flex: 1 },
  listContainer: { paddingTop: 12, paddingHorizontal: 20, gap: 10 },
  section: {
    paddingTop: 8,
    paddingBottom: 2,
    fontFamily: 'Commissioner_600SemiBold',
  },
}));
