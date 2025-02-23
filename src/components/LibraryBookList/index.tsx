import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useUserBooks } from 'api/app/hooks';
import { AuthContext } from 'api/auth/AuthProvider';

import { LibraryNavigatorParamList } from 'navigation/AppStack/params';

import { translations } from 'locales/translations';

import Book from '../Book';
import Icon from '../Icon';
import Text from '../Text';

type BookListProps = { kind: 'current' | 'past' };

export interface LibraryPageProps
  extends StackNavigationProp<LibraryNavigatorParamList, 'Library'> {}

const CurrentBooks = ({ kind }: BookListProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<LibraryPageProps>();
  const { user } = useContext(AuthContext);
  const books = useUserBooks({ withRefs: true });

  const handleBook = (book: (typeof books)[number]) => {
    navigate('Book', {
      book,
    });
  };

  const handleRead = async (bookId: string, isRead: boolean) => {
    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('books')
        .doc(bookId)
        .update({
          isRead: !isRead,
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePress = () => {
    navigate('Search');
  };

  return (
    <View style={styles.container}>
      <Text
        text={
          kind === 'current'
            ? t(translations.library.current)
            : t(translations.library.past)
        }
        kind="header"
      />

      {kind === 'current' && (
        <TouchableOpacity style={styles.text} onPress={handlePress}>
          <Icon icon="plus" color="grey" />
          <Text
            kind="paragraph"
            text={t(translations.library.searchTitle)}
            color="grey"
          />
        </TouchableOpacity>
      )}

      <View>
        {books.map(book =>
          book.isRead === false && kind === 'current' ? (
            <Book
              key={book.id}
              title={book.volumeInfo?.title}
              author={book.volumeInfo?.authors?.join?.(', ')}
              kind="library"
              isChecked={book.isRead}
              onPress={() => handleBook(book)}
              onChange={() => handleRead(book.id, book.isRead)}
            />
          ) : (
            book.isRead &&
            kind === 'past' && (
              <Book
                key={book.id}
                title={book.volumeInfo?.title}
                author={book.volumeInfo?.authors?.join?.(', ')}
                kind="library"
                isChecked={book.isRead}
                onPress={() => handleBook(book)}
                onChange={() => handleRead(book.id, book.isRead)}
              />
            )
          ),
        )}
      </View>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    gap: 20,
  },
  text: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 17,
    gap: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'dashed',
    alignItems: 'center',
    borderColor: 'grey',
  },
}));

export default CurrentBooks;
