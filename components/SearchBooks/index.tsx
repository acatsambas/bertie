import React from "react";
import { View } from "react-native";

import Book from "../Book";

const SearchBooks = ({ books }) => {
  console.log(books);
  return (
    <View>
      {Object.keys(books).length !== 0 &&
        books.map((book) => (
          <Book kind="search" title={book.volumeInfo.title} author="Test" />
        ))}
      {/* <Book kind="search" author="Agatha Christie" title="Death on the Nile" />
      <Book
        kind="search"
        author="Agatha Christie"
        title="The Mysterious Affair at Styles"
      />
      <Book
        kind="search"
        author="Agatha Christie"
        title="Murder on the Orient Express"
      /> */}
    </View>
  );
};

export default SearchBooks;
