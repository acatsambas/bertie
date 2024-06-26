import React from "react";
import { View } from "react-native";
import Book from "../Book";

const SearchBooks = () => {
  return (
    <View>
      <Book kind="search" author="Agatha Christie" title="Death on the Nile" />
      <Book
        kind="search"
        author="Agatha Christie"
        title="The Mysterious Affair at Styles"
      />
      <Book
        kind="search"
        author="Agatha Christie"
        title="Murder on the Orient Express"
      />
    </View>
  );
};

export default SearchBooks;
