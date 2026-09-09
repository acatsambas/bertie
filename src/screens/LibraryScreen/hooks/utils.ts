export type LibraryBook = {
  id: string;
  isRead?: boolean;
  volumeInfo?: {
    title?: string;
    authors?: string[];
  };
  [key: string]: any;
};

export type CategorisedBooks = {
  current: LibraryBook[];
  past: LibraryBook[];
};

/**
 * Split the library into what someone is reading now and what they have
 * finished. These used to be two sections of one long list; they are now two
 * tabs, so the shape is a pair of lists rather than a flattened array with
 * section headers interleaved.
 */
export const categorizeBooks = (rawBooks): CategorisedBooks => {
  const allBooks: LibraryBook[] =
    rawBooks?.pages?.flatMap(page => page.books) ?? [];

  return {
    current: allBooks.filter(book => !book.isRead),
    past: allBooks.filter(book => book.isRead),
  };
};
