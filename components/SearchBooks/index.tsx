import React, { useContext, useState } from "react";
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
  const { navigate } = useNavigation<SearchBookProps>();
  const { user } = useContext(AuthContext);
  const userId = user.uid;

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
    isRead: boolean
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

  return (
    <View>
      {Object.keys(books).length !== 0 &&
        books.map((book: any) => (
          <Book
            key={book.key.replace("/works/", "")}
            kind="search"
            title={book.title}
            author={
              book?.author_name?.length > 1
                ? book?.author_name.map(
                    (author: string, index: number) =>
                      (index ? ", " : "") + author
                  )
                : book.author_name
            }
            onPress={() =>
              handleBook(
                book?.key.replace("/works/", ""),
                book?.title,
                book?.author_name?.length > 1
                  ? book?.author_name.map(
                      (author: string, index: number) =>
                        (index ? ", " : "") + author
                    )
                  : book.author_name
              )
            }
            onChange={() =>
              handleAddBook(
                book?.key.replace("/works/", ""),
                book?.title,
                book?.author_name,
                false
              )
            }
          />
        ))}
    </View>
  );
};

export default SearchBooks;
