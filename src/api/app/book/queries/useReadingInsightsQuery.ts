import { useQuery } from '@tanstack/react-query';
import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';
import { auth, db } from 'api/firebase';
import {
  BookInsightsMeta,
  fetchBookInsightsMeta,
} from 'api/google-books/fetchBookInsightsMeta';
import { useGuest } from 'api/guest/GuestProvider';
import { readGuestData } from 'api/guest/guestStore';

/** A book the reader has finished, with what Insights groups it by. */
export interface ReadBook {
  id: string;
  authors: string[];
  categories: string[];
  firstPublishYear: number | null;
  rating?: RatingValue;
}

interface KnownBook {
  authors?: string[];
  insights?: BookInsightsMeta;
}

interface Sources {
  /** Every book the reader has finished: ticked as read, or rated. */
  ids: string[];
  ratings: Record<string, RatingValue>;
  /** What's already stored about those books, keyed by id. */
  known: Record<string, KnownBook>;
}

// Firestore caps an `in` filter at 30 values.
const IN_LIMIT = 30;
// Enough to fill a first visit quickly without tripping Google's rate limit.
const MAX_GOOGLE_FETCHES = 4;

const chunk = <T>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, (i + 1) * size),
  );

const mapWithLimit = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
) => {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
};

const readGuestSources = async (): Promise<Sources> => {
  const { books, ratings } = await readGuestData();
  const readIds = Object.keys(books).filter(id => books[id].isRead);

  return {
    ids: [...new Set([...readIds, ...Object.keys(ratings)])],
    ratings,
    known: Object.fromEntries(
      Object.entries(books).map(([id, { book }]) => [
        id,
        { authors: book.volumeInfo?.authors },
      ]),
    ),
  };
};

const readUserSources = async (userId: string): Promise<Sources> => {
  const [entries, ratingDocs] = await Promise.all([
    getDocs(collection(db, 'users', userId, 'books')),
    getDocs(query(collection(db, 'ratings'), where('userId', '==', userId))),
  ]);

  const readIds = entries.docs
    .filter(snapshot => snapshot.data().isRead)
    .map(snapshot => snapshot.id);
  const ratings = Object.fromEntries(
    ratingDocs.docs.map(snapshot => {
      const { bookId, rating } = snapshot.data();
      return [bookId as string, rating as RatingValue];
    }),
  );
  const ids = [...new Set([...readIds, ...Object.keys(ratings)])];

  const bookDocs = await Promise.all(
    chunk(ids, IN_LIMIT).map(batch =>
      getDocs(query(collection(db, 'books'), where(documentId(), 'in', batch))),
    ),
  );
  const known: Record<string, KnownBook> = {};
  bookDocs.forEach(snapshot =>
    snapshot.docs.forEach(bookDoc => {
      const data = bookDoc.data();
      known[bookDoc.id] = {
        authors: data.volumeInfo?.authors,
        insights: data.insights,
      };
    }),
  );

  return { ids, ratings, known };
};

/**
 * Every book the reader has finished, with its authors, genres and the
 * year it first came out, for the Insights tab.
 *
 * Saved books only carry a title, authors and description, so genres come
 * from Google Books and first publication from Open Library. Each book is
 * looked up once and the answer
 * cached on its shared `books/{id}` document, so the next reader of the same
 * book — and every later visit — reads it from Firestore instead of spending
 * the app's Google quota.
 */
export const useReadingInsightsQuery = () => {
  const { isGuest } = useGuest();
  const userId = auth.currentUser?.uid;

  return useQuery<ReadBook[]>({
    queryKey: ['readingInsights', isGuest, userId],
    queryFn: async () => {
      if (!isGuest && !userId) return [];

      const { ids, ratings, known } = isGuest
        ? await readGuestSources()
        : await readUserSources(userId!);

      return mapWithLimit(ids, MAX_GOOGLE_FETCHES, async id => {
        const stored = known[id];
        let authors = stored?.authors ?? [];
        let meta = stored?.insights;

        if (!meta) {
          try {
            const fetched = await fetchBookInsightsMeta(id);
            meta = fetched.meta;
            if (!authors.length) authors = fetched.authors;

            // Only onto books that already have a document: a rated book
            // can lack one, and a guest can't write at all.
            if (!isGuest && stored) {
              updateDoc(doc(db, 'books', id), { insights: meta }).catch(error =>
                console.warn('Could not cache book insights:', error),
              );
            }
          } catch (error) {
            // Still counts towards authors and ratings; the next visit retries.
            console.warn('Could not fetch book insights:', error);
          }
        }

        return {
          id,
          authors,
          categories: meta?.categories ?? [],
          firstPublishYear: meta?.firstPublishYear ?? null,
          rating: ratings[id],
        };
      });
    },
    enabled: isGuest || !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
