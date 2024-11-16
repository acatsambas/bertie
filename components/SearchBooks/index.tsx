import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View } from 'react-native';

import { useUserBooks } from '../../api/app/hooks';
import { AuthContext } from '../../api/auth/AuthProvider';
import { BookResult } from '../../api/google-books/search';
import { LibraryNavigatorParamList } from '../../navigation/AppStack/params';
import Book from '../Book';

export interface SearchBookProps {
  books: BookResult[];
}

const SearchBooks = ({ books }: SearchBookProps) => {
  const { navigate } =
    useNavigation<StackNavigationProp<LibraryNavigatorParamList, 'Search'>>();
  const { user } = useContext(AuthContext);
  const userBooks = useUserBooks();

  const handlePressBook = (book: BookResult) => {
    navigate('Book', {
      book,
    });
  };

  const handlePressAddBook = async (book: BookResult, isUserBook: boolean) => {
    await firestore().collection('books').doc(book.id).set(book);

    if (isUserBook) {
      await firestore()
        .collection('users')
        .doc(user?.uid)
        .collection('books')
        .doc(book.id)
        .delete();
    } else {
      await firestore()
        .collection('users')
        .doc(user?.uid)
        .collection('books')
        .doc(book.id)
        .set({ bookRef: firestore().collection('books').doc(book.id) });
    }
  };

  return (
    <View>
      {books.map(book => {
        const isUserBook = !!userBooks.find(({ id }) => id === book?.id);

        return (
          <Book
            key={book.id}
            isChecked={isUserBook}
            kind="search"
            title={book.volumeInfo.title}
            author={book.volumeInfo.authors?.join?.(', ')}
            onPress={() => handlePressBook(book)}
            onChange={() => handlePressAddBook(book, isUserBook)}
          />
        );
      })}
    </View>
  );
};

export default SearchBooks;
