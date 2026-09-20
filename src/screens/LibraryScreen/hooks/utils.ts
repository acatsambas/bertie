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

/** Which shelves My list is showing. */
export type LibraryFilter = 'current' | 'past' | 'both';

export type LibraryListItem =
  | { type: 'section'; id: string; shelf: 'current' | 'past' }
  | { type: 'book'; id: string; book: LibraryBook };

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
export const categorizeBooks = (...sources): CategorisedBooks => {
  const byId = new Map<string, LibraryBook>();
  sources.forEach(source =>
    source?.pages?.forEach(page =>
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

/**
 * Flatten Current / Past into one list for the screen. When the filter is
 * Both, Current comes first, then Past, with a section label between groups
 * (and before Past even when Current is empty, so the Past label still shows
 * once there are finished books).
 */
export const buildLibraryList = (
  filter: LibraryFilter,
  current: LibraryBook[],
  past: LibraryBook[],
): LibraryListItem[] => {
  const toBookItems = (books: LibraryBook[]): LibraryListItem[] =>
    books.map(book => ({ type: 'book', id: book.id, book }));

  if (filter === 'current') return toBookItems(current);
  if (filter === 'past') return toBookItems(past);

  const items: LibraryListItem[] = [];
  if (current.length > 0) {
    items.push({ type: 'section', id: 'section-current', shelf: 'current' });
    items.push(...toBookItems(current));
  }
  if (past.length > 0) {
    items.push({ type: 'section', id: 'section-past', shelf: 'past' });
    items.push(...toBookItems(past));
  }
  return items;
};
