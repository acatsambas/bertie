import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import Book from "../Book";

export interface SearchBookProps
  extends StackNavigationProp<LibraryNavigatorParamList, "Search"> {}

const SearchBooks = ({ books }) => {
  const { navigate } = useNavigation<SearchBookProps>();
  const handleBook = (id: string, title: string, author: string) => {
    navigate("Book", {
      id: id,
      bookName: title,
      author: author,
    });
  };

  return (
    <View>
      {Object.keys(books).length !== 0 &&
        books.map((book: any) => (
          <Book
            key={book.id}
            kind="search"
            title={book.volumeInfo.title}
            author={
              book?.volumeInfo?.authors?.length > 1
                ? book.volumeInfo.authors.map(
                    (author: string, index: number) =>
                      (index ? ", " : "") + author
                  )
                : book.volumeInfo.authors
            }
            onPress={() =>
              handleBook(
                book.id,
                book.volumeInfo.title,
                book?.volumeInfo?.authors?.length > 1
                  ? book.volumeInfo.authors.map(
                      (author: string, index: number) =>
                        (index ? ", " : "") + author
                    )
                  : book.volumeInfo.authors
              )
            }
          />
        ))}
    </View>
  );
};

export default SearchBooks;
