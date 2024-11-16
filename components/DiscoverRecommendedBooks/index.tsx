import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useMemo } from 'react';
import { View } from 'react-native';

import { useBooks, useUserBooks } from '../../api/app/hooks';
import { AuthContext } from '../../api/auth/AuthProvider';
import Book from '../Book';

const SearchBooks = () => {
  const { navigate } = useNavigation<any>();
  const { user } = useContext(AuthContext);
  const userBooks = useUserBooks();
  const recommendedIds = useMemo(
    () => [
      'MSurBex2xcUC',
      'Nn-WDwAAQBAJ',
      'fn20CwAAQBAJ',
      'n5orAQAAMAAJ',
      'olyPEAAAQBAJ',
    ],
    [],
  );
  const books = useBooks({
    ids: recommendedIds,
  });

  const handleBook = (
    book: Partial<ReturnType<typeof useUserBooks>[number]>,
  ) => {
    navigate('LibraryNavigator', {
      screen: 'Book',
      params: {
        book,
      },
    });
  };

  const handleAddBook = async (
    book: Partial<ReturnType<typeof useUserBooks>[number]>,
  ) => {
    const bookRef = firestore()
      .collection('users')
      .doc(user?.uid)
      .collection('books')
      .doc(book.id);

    if ((await bookRef.get()).exists) {
      bookRef.delete();
    } else {
      bookRef.set({ bookRef: firestore().collection('books').doc(book.id) });
    }
  };

  return (
    <View>
      {books.map(book => (
        <Book
          key={book.id}
          isChecked={userBooks.some(({ id }) => id === book.id)}
          kind="search"
          title={book.volumeInfo.title}
          author={book.volumeInfo.authors?.join(', ')}
          onPress={() => handleBook(book)}
          onChange={() => handleAddBook(book)}
        />
      ))}
    </View>
  );
};

export default SearchBooks;
