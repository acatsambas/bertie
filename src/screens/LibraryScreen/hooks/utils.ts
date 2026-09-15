import { byListDateDesc } from 'api/app/book/userBookOrder';

export type LibraryBook = {
  id: string;
  isRead?: boolean;
  /** Epoch ms; see UserBook. */
  addedAt?: number;
  readAt?: number;
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
 *
 * Each tab is newest first: Current by when a book was added, Past by when it
 * was read. The query already returns that order; sorting again here keeps a
 * book that was just ticked in the right place before the refetch lands.
 */
export const categorizeBooks = (rawBooks): CategorisedBooks => {
  const allBooks: LibraryBook[] =
    rawBooks?.pages?.flatMap(page => page.books) ?? [];

  return {
    current: allBooks.filter(book => !book.isRead).sort(byListDateDesc),
    past: allBooks.filter(book => book.isRead).sort(byListDateDesc),
  };
};
