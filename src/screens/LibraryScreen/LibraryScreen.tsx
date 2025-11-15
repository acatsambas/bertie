import { LegendList, LegendListRenderItemProps } from '@legendapp/list';
import { makeStyles } from '@rneui/themed';
import { useContext, useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Book from 'components/Book';

import { AuthContext } from 'api/auth/AuthProvider';

import { ListHeader, SectionHeader } from './components';
import { useLibrary } from './hooks';
import { LibraryListItem } from './hooks/utils';

export const LibraryScreen = () => {
  const styles = useStyles();
  const { user } = useContext(AuthContext);
  const {
    books,
    handleOnPressBook,
    handleOnRead,
    handleAddBook,
    fetchMoreBooks,
    loading,
  } = useLibrary(user);

  const flatData = useMemo(() => {
    return books;
  }, [books]);

  const renderItem = ({ item }: LegendListRenderItemProps<LibraryListItem>) => {
    if (item.type === 'section-header') {
  return (
          <SectionHeader
          title={item.title}
          id={item.id}
            handleAddBook={handleAddBook}
          />
      );
    }

    return (
          <Book
            title={item.volumeInfo?.title}
            author={item.volumeInfo?.authors?.join?.(', ')}
            kind="library"
            isChecked={item.isRead}
            onPress={() => handleOnPressBook(item)}
            onChange={() => handleOnRead(item.id, item.isRead)}
          />
    );
  };

  const keyExtractor = (item: LibraryListItem) => {
    if (item.type === 'section-header') {
      return `section-${item.id}`;
    }
    return item.id;
  };

  const getItemType = (item: LibraryListItem) => {
    return item.type;
  };

  return (
    <SafeAreaView edges={['left', 'right', 'top']} style={styles.safeAreaView}>
      <LegendList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        data={flatData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={70}
        initialContainerPoolRatio={2}
        ListHeaderComponent={<ListHeader />}
        onEndReached={fetchMoreBooks}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : <View />}
        recycleItems={true}
        maintainVisibleContentPosition
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  list: { flex: 1 },
  listContainer: { paddingTop: 20, gap: 10 },
}));
