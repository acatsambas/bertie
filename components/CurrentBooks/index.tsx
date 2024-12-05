import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useUserBooks } from '../../api/app/hooks';
import { AuthContext } from '../../api/auth/AuthProvider';
import { translations } from '../../locales/translations';
import { LibraryNavigatorParamList } from '../../navigation/AppStack/params';
import Book from '../Book';
import Icon from '../Icon';
import Text from '../Text';
import LoadingState from '../LoadingState/LoadingState';

export interface LibraryPageProps
  extends StackNavigationProp<LibraryNavigatorParamList, 'Library'> {}

const CurrentBooks = () => {
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
      <Text text={t(translations.library.current)} kind="header" />

      <TouchableOpacity style={styles.text} onPress={handlePress}>
        <Icon icon="plus" color="grey" />
        <Text
          kind="paragraph"
          text={t(translations.library.searchTitle)}
          color="grey"
        />
      </TouchableOpacity>

      <View>
        {books
          .filter(({ isRead }) => !isRead)
          .map(book => (
            <Book
              key={book.id}
              title={book.volumeInfo?.title}
              author={book.volumeInfo?.authors?.join?.(', ')}
              kind="library"
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
  },
  text: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'dashed',
    alignItems: 'center',
    borderColor: 'grey',
  },
}));

export default CurrentBooks;
