import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';

import {
  useAddBookToLibraryMutation,
  useUserBooksIdsQuery,
} from 'api/app/book';
import { BookResult } from 'api/google-books/search';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import Book from '../Book';

export interface SearchBookProps {
  books: BookResult[];
}

const SearchBooks = ({ books }: SearchBookProps) => {
  const { navigate } =
    useNavigation<
      StackNavigationProp<NavigationType, typeof Routes.LIBRARY_03_SEARCH>
    >();
  const { data: userBooksIds = [] } = useUserBooksIdsQuery();
  const { mutate: addBook } = useAddBookToLibraryMutation();

  const handlePressBook = (book: BookResult) => {
    navigate(Routes.LIBRARY_02_BOOK, {
      book,
    });
  };

  const handlePressAddBook = (book: BookResult, isUserBook: boolean) => {
    addBook({ book, isUserBook });
  };

  return (
    <View style={{ gap: 10 }}>
      {books.map(book => {
        const isUserBook = userBooksIds.some(({ id }) => id === book?.id);
        return (
          <Book
            key={book.id}
            isChecked={isUserBook}
            kind="search"
            title={book.volumeInfo?.title}
            author={book.volumeInfo?.authors?.join?.(', ')}
            onPress={() => handlePressBook(book)}
            onChange={() => handlePressAddBook(book, isUserBook)}
          />
        );
      })}
    </View>
  );
};

export default SearchBooks;
