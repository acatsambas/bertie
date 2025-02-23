export interface BookResult {
  id: string;
  volumeInfo?: {
    authors?: string[];
    description?: string;
    title: string;
  };
}

export const searchBooks = async (
  query: string,
  toggleWord: 'intitle' | 'inauthor' = 'intitle',
) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${toggleWord}:${query}&fields=items/volumeInfo/title,items/id,items/volumeInfo/description,items/volumeInfo/authors&orderBy=relevance&maxResults=40&key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`,
  );

  const json = (await response.json()).items as BookResult[];

  return (
    json?.filter?.(
      (book, index, self) => index === self.findIndex(b => b.id === book.id),
    ) || []
  );
};
