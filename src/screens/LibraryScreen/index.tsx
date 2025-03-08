import { makeStyles } from '@rneui/themed';
import { useContext } from 'react';
import { SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Book from 'components/Book';

import { AuthContext } from 'api/auth/AuthProvider';

import { ListHeader, SectionHeader } from './components';
import { useLibrary } from './hooks';

const LibraryScreen = () => {
  const styles = useStyles();
  const { user } = useContext(AuthContext);
  const { books, handleOnPressBook, handleOnRead, handleAddBook } =
    useLibrary(user);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <SectionList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        sections={books}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={<ListHeader />}
        renderSectionHeader={({ section }) => (
          <SectionHeader
            title={section.title}
            id={section.id}
            handleAddBook={handleAddBook}
          />
        )}
        renderItem={({ item }) => (
          <Book
            key={item.id}
            title={item.volumeInfo?.title}
            author={item.volumeInfo?.authors?.join?.(', ')}
            kind="library"
            isChecked={item.isRead}
            onPress={() => handleOnPressBook(item)}
            onChange={() => handleOnRead(item.id, item.isRead)}
          />
        )}
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

export default LibraryScreen;
