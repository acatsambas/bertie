import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

import { LibraryNavigatorParamList } from '../../navigation/AppStack/params';
import { AuthContext } from '../../api/auth/AuthProvider';
import Book from '../Book';

export interface SearchBookProps
  extends StackNavigationProp<LibraryNavigatorParamList, 'Search'> {}

const SearchBooks = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [existingBooks, setExistingBooks] = useState([]);
  const { navigate } = useNavigation<SearchBookProps>();
  const { user } = useContext(AuthContext);
  const userId = user.uid;

  // Hard-coded books data
  const books = [
    {
      id: '1TJgCMgxDU1UC',
      title: 'The Canterbury Tales',
      authors: ['Geoffrey Chaucer'],
      description: 'n/a',
    },
    {
      id: 'f6txCwAAQBAJ',
      title: 'A Gentleman in Moscow',
      authors: ['Amor Towles'],
      description: 'n/a',
    },
    {
      id: 'cGCYAwAAQBAJ',
      title: 'Family Furnishings',
      authors: ['Alice Munro'],
      description: 'Description of Book 3',
    },
    {
      id: 'MSurBex2xcUC',
      title: 'The Remains of the Day',
      authors: ['Kazuo Ishiguro'],
      description: 'n/a',
    },
    {
      id: 'LDy8DwAAQBAJ',
      title: 'The Glass Hotel',
      authors: ['Emily St. John Mandel'],
      description: 'n/a',
    },
  ];

  useEffect(() => {
    handleStoredBooks();
  }, []);

  const handleBook = (id: string, title: string, author: string) => {
    navigate('Book', {
      id: id,
      bookName: title,
      author: author,
    });
  };

  const handleAddBook = async (
    id: string,
    title: string,
    author: string,
    isRead: boolean,
    description: string,
  ) => {
    try {
      !isSaved
        ? await firestore()
            .collection('users')
            .doc(userId)
            .collection('books')
            .doc(id)
            .set(
              {
                author: author,
                bookId: id,
                isRead: isRead,
                title: title,
                description: description,
              },
              { merge: true },
            )
        : await firestore()
            .collection('users')
            .doc(userId)
            .collection('books')
            .doc(id)
            .delete();
      setIsSaved(!isSaved);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStoredBooks = async () => {
    const booksSnapshop = await firestore()
      ?.collection('users')
      ?.doc(userId)
      ?.collection('books')
      .get();

    const savedBooks = booksSnapshop.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setExistingBooks(savedBooks);
  };

  return (
    <View>
      {books.map(book => (
        <Book
          key={book.id}
          isChecked={existingBooks.find(
            existingBook => existingBook.bookId === book.id,
          )}
          kind="search"
          title={book.title}
          author={book.authors.join(', ')}
          onPress={() =>
            handleBook(book.id, book.title, book.authors.join(', '))
          }
          onChange={() =>
            handleAddBook(
              book.id,
              book.title,
              book.authors.join(', '),
              false,
              book.description,
            )
          }
        />
      ))}
    </View>
  );
};

export default SearchBooks;
