import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { makeStyles } from '@rneui/themed';

import { AuthContext } from '../../api/auth/AuthProvider';
import Book from '../Book';

const OrderBooksList = () => {
  const [books, setBooks] = useState([]);
  const { user } = useContext(AuthContext);
  const userId = user.uid;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const userBooksSnapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('books')
      .get();

    const booksList = userBooksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(booksList);
  };

  const handleRemoveBook = (id: string) => {
    const element = books.find(book => book.id === id); //find element
    const index = books.indexOf(element); //find its index
    books.splice(index, 1); //remove element
  };

  const styles = useStyles();
  return (
    <View style={styles.container}>
      {books.map(
        book =>
          book.isRead === false && (
            <Book
              key={book.id}
              title={book.title}
              author={book.author}
              kind="order"
              isChecked={book.isRead}
              onChange={() => handleRemoveBook(book.id)}
            />
          ),
      )}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: { gap: 10 },
}));

export default OrderBooksList;
