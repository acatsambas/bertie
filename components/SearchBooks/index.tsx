import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from "@react-native-firebase/firestore";

import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import { AuthContext } from "../../api/auth/AuthProvider";
import Book from "../Book";

export interface SearchBookProps
  extends StackNavigationProp<LibraryNavigatorParamList, "Search"> {}

const SearchBooks = ({ books }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [existingBooks, setExistingBooks] = useState([]);
  const { navigate } = useNavigation<SearchBookProps>();
  const { user } = useContext(AuthContext);
  const userId = user.uid;

  useEffect(() => {
    handleStoredBooks();
  }, [books]);

  const handleBook = (id: string, title: string, author: string) => {
    navigate("Book", {
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
    description: string
  ) => {
    try {
      !isSaved
        ? await firestore()
            .collection("users")
            .doc(userId)
            .collection("books")
            .doc(id)
            .set(
              {
                author: author,
                bookId: id,
                isRead: isRead,
                title: title,
                description: description,
              },
              { merge: true }
            )
        : await firestore()
            .collection("users")
            .doc(userId)
            .collection("books")
            .doc(id)
            .delete();
      setIsSaved(!isSaved);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStoredBooks = async () => {
    const booksSnapshop = await firestore()
      ?.collection("users")
      ?.doc(userId)
      ?.collection("books")
      .get();

    const savedBooks = booksSnapshop.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setExistingBooks(savedBooks);
  };

  return (
    <View>
      {Object?.keys(books || {})?.length !== 0 &&
        books.map((book: any) => (
          <Book
            key={book?.id}
            isChecked={existingBooks.find(
              (existingBook) => existingBook?.bookId === book?.id
            )}
            kind="search"
            title={book?.volumeInfo?.title}
            author={
              book?.volumeInfo?.authors?.length > 1
                ? book.volumeInfo.authors.map(
                    (author: string, index: number) =>
                      (index ? ", " : "") + author
                  )
                : book?.volumeInfo?.authors
            }
            onPress={() =>
              handleBook(
                book?.id,
                book?.volumeInfo?.title,
                book?.volumeInfo?.authors?.length > 1
                  ? book?.author_name?.map(
                      (author: string, index: number) =>
                        (index ? ", " : "") + author
                    )
                  : book?.volumeInfo?.authors
              )
            }
            onChange={() =>
              handleAddBook(
                book?.id,
                book?.volumeInfo?.title,
                book?.volumeInfo?.authors,
                false,
                book?.volumeInfo?.description
              )
            }
          />
        ))}
    </View>
  );
};

export default SearchBooks;
