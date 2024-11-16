import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';

import { useUserBooks } from '../../api/app/hooks';
import { AuthContext } from '../../api/auth/AuthProvider';
import { translations } from '../../locales/translations';
import { LibraryNavigatorParamList } from '../../navigation/AppStack/params';
import Book from '../Book';
import Text from '../Text';

export interface LibraryPageProps
  extends StackNavigationProp<LibraryNavigatorParamList, 'Library'> {}

const PastBooks = () => {
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

  return (
    <View style={styles.container}>
      <Text text={t(translations.library.past)} kind="header" />

      <View>
        {books
          .filter(({ isRead }) => isRead)
          .map(book => (
            <Book
              key={book.id}
              title={book.volumeInfo.title}
              author={book.volumeInfo.authors?.join(', ')}
              kind="library"
              isChecked={book.isRead}
              onPress={() => handleBook(book)}
              onChange={() => handleRead(book.id, book.isRead)}
            />
          ))}
      </View>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    gap: 20,
    paddingBottom: Platform.OS === 'ios' ? 80 : 120,
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

export default PastBooks;
