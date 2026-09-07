import { BookResult } from './search';

export const fetchBook = async (bookId: string): Promise<BookResult> => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?fields=id,volumeInfo/title,volumeInfo/authors,volumeInfo/description&key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch book ${bookId}: ${response.status}`);
  }

  return response.json();
};
