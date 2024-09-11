import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { makeStyles } from "@rneui/themed";

import { AuthContext } from "../../api/auth/AuthProvider";
import Book from "../Book";

const OrderBooksList = () => {
  const [books, setBooks] = useState([]);
  const { user } = useContext(AuthContext);
  const userId = user.uid;

  useEffect(() => {
    fetchBooks();
  }, [books]);

  const fetchBooks = async () => {
    const userBooksSnapshot = await firestore()
      .collection("users")
      .doc(userId)
      .collection("books")
      .get();

    const booksList = userBooksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(booksList);
  };

  const handleRemoveBook = async (id: string) => {
    console.log(id);
    await firestore()
      .collection("users")
      .doc(userId)
      .collection("books")
      .doc(id)
      .delete();
  };
  const styles = useStyles();
  return (
    <View style={styles.container}>
      {books.map(
        (book) =>
          book.isRead === false && (
            <Book
              key={book.id}
              title={book.title}
              author={book.author}
              kind="order"
              isChecked={book.isRead}
              onChange={() => handleRemoveBook(book.id)}
            />
          )
      )}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: { gap: 10 },
}));

export default OrderBooksList;
