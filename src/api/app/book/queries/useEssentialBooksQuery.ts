import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

import { db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';

/** How many books Discover shows under "essential reads". */
const ESSENTIAL_LIMIT = 10;

/**
 * The books our readers say everyone must read at least once.
 *
 * A book is essential when the median of its ratings is 4, which each rating
 * write keeps up to date on the book itself (see `ratingStats`). This used to
 * download every rating document in the database and take the medians here —
 * every visit to Discover, to pick ten books — so it grew with the number of
 * ratings ever given rather than with the number of books shown.
 *
 * Readable without an account: guests browse Discover too.
 */
export const useEssentialBooksQuery = () =>
  useQuery<BookResult[]>({
    queryKey: ['essentialBooks'],
    queryFn: async () => {
      const snapshot = await getDocs(
        query(
          collection(db, 'books'),
          where('essential', '==', true),
          limit(ESSENTIAL_LIMIT),
        ),
      );

      return (
        snapshot.docs
          .map(
            document =>
              ({
                id: document.id,
                ...document.data(),
              }) as BookResult,
          )
          // A tally can outlive the volume it was written against, and a book
          // with no title has nothing to show on a shelf.
          .filter(book => !!book.volumeInfo?.title)
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
