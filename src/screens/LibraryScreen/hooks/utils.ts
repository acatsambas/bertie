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

/** Which shelf My list is showing. */
export type LibraryFilter = 'current' | 'past';

/**
 * Split the library into what someone is reading now and what they have
 * finished.
 *
 * Takes the pages of each shelf's query. A book just ticked or unticked is
 * still in its old shelf's pages until the refetch lands, so it's sorted by
 * its flag, not by where it came from, and counted once.
 *
 * Each shelf is newest first: Current by when a book was added, Past by when
 * it was read. The query already returns that order; sorting again here keeps
 * a book that was just ticked in the right place before the refetch lands.
 */
export const categorizeBooks = (
  ...sources: Array<{ pages: Array<{ books: LibraryBook[] }> } | undefined>
): CategorisedBooks => {
  const byId = new Map<string, LibraryBook>();
  sources.forEach(source =>
    source?.pages?.forEach((page: { books: LibraryBook[] }) =>
      page.books.forEach((book: LibraryBook) => {
        if (!byId.has(book.id)) byId.set(book.id, book);
      }),
    ),
  );
  const allBooks = [...byId.values()];

  return {
    current: allBooks.filter(book => !book.isRead).sort(byListDateDesc),
    past: allBooks.filter(book => book.isRead).sort(byListDateDesc),
  };
};
