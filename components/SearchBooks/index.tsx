import React from "react";
import { View } from "react-native";

import Book from "../Book";

const SearchBooks = ({ books }) => {
  console.log(books);
  const handlePress = () => {
    //TODO: Navigation
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
            onPress={handlePress}
          />
        ))}
    </View>
  );
};

export default SearchBooks;
