import { LegendList, LegendListRenderItemProps } from '@legendapp/list';
import { Tab, makeStyles } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Book from 'components/Book';
import Text from 'components/Text';

import { translations } from 'locales/translations';

import { AddBookButton, ListHeader } from './components';
import { useLibrary } from './hooks';
import { LibraryBook } from './hooks/utils';

const CURRENT_TAB = 0;

export const LibraryScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [tab, setTab] = useState(CURRENT_TAB);
  const {
    currentBooks,
    pastBooks,
    handleOnPressBook,
    handleOnRead,
    handleAddBook,
    fetchMoreBooks,
    hasNextPage,
    loading,
  } = useLibrary();

  const isCurrent = tab === CURRENT_TAB;
  const books = isCurrent ? currentBooks : pastBooks;

  // Paging walks the whole library, not one tab of it, so the selected tab can
  // legitimately be empty while its books sit in a page that has not loaded.
  // An empty list never reaches its end, so onEndReached cannot rescue it —
  // keep pulling pages until this tab has something or the library runs out.
  useEffect(() => {
    if (books.length === 0 && hasNextPage && !loading) {
      fetchMoreBooks();
    }
  }, [books.length, hasNextPage, loading, fetchMoreBooks]);

  const renderItem = ({ item }: LegendListRenderItemProps<LibraryBook>) => (
    <Book
      title={item.volumeInfo?.title}
      author={item.volumeInfo?.authors?.join?.(', ')}
      kind="library"
      isChecked={item.isRead}
      onPress={() => handleOnPressBook(item)}
      onChange={() => handleOnRead(item.id, item.isRead)}
    />
  );

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
    <SafeAreaView edges={['left', 'right', 'top']} style={styles.safeAreaView}>
      <View style={styles.container}>
        <ListHeader />
        <Tab
          value={tab}
          onChange={setTab}
          titleStyle={{
            fontFamily: 'GoudyBookletter1911_400Regular',
            fontSize: 24,
          }}
        >
          <Tab.Item>{t(translations.library.current)}</Tab.Item>
          <Tab.Item>{t(translations.library.past)}</Tab.Item>
        </Tab>
        <LegendList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          data={books}
          renderItem={renderItem}
          keyExtractor={(item: LibraryBook) => item.id}
          estimatedItemSize={70}
          initialContainerPoolRatio={2}
          ListHeaderComponent={
            isCurrent ? <AddBookButton onPress={handleAddBook} /> : undefined
          }
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
  list: { flex: 1 },
  listContainer: { paddingTop: 20, paddingHorizontal: 20, gap: 10 },
  empty: {
    paddingTop: 20,
    textAlign: 'center',
  },
}));
