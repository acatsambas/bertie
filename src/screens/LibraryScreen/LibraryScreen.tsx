import { LegendList, LegendListRenderItemProps } from '@legendapp/list';
import { makeStyles } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Book from 'components/Book';
import EmptyState from 'components/EmptyState';
import { translations } from 'locales/translations';

import {
  AddBookButton,
  DesktopLibrary,
  LibraryShelfFilter,
  ListHeader,
} from './components';
import { useLibrary } from './hooks';
import { LibraryBook, LibraryFilter } from './hooks/utils';

/** Desktop browsers get the cover grid; everywhere else keeps this list. */
export const LibraryScreen = () =>
  useIsDesktop() ? <DesktopLibrary /> : <MobileLibraryScreen />;

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

const MobileLibraryScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<LibraryFilter>('current');
  const {
    books,
    handleOnPressBook,
    handleOnRead,
    handleAddBook,
    fetchMoreBooks,
    loading,
  } = useLibrary(filter);

  const renderItem = ({
    item: book,
  }: LegendListRenderItemProps<LibraryBook>) => {
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
          data={books}
          renderItem={renderItem}
          keyExtractor={(book: LibraryBook) => book.id}
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
}));
