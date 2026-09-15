import { useQueries, useQuery } from '@tanstack/react-query';
import {
  DocumentData,
  collection,
  documentId,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { saveBookInsights } from 'api/app/book/cacheBookInsights';
import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';
import { auth, db } from 'api/firebase';
import {
  BookInsightsMeta,
  fetchBookInsightsMeta,
} from 'api/google-books/fetchBookInsightsMeta';
import { useGuest } from 'api/guest/GuestProvider';
import { readGuestData } from 'api/guest/guestStore';

import { createLimiter } from 'utils/mapWithLimit';

/** A book the reader has finished, with what Insights groups it by. */
export interface ReadBook {
  id: string;
  authors: string[];
  categories: string[];
  firstPublishYear: number | null;
  rating?: RatingValue;
}

/** A finished book as stored; `insights` is missing until it's looked up. */
interface FinishedBook {
  id: string;
  authors: string[];
  insights?: BookInsightsMeta;
  rating?: RatingValue;
  /** Whether it has a shared books/{id} document to cache a lookup on. */
  hasDoc: boolean;
}

// Firestore caps an `in` filter at 30 values.
const IN_LIMIT = 30;
// Enough to get through a first visit quickly without tripping Google's
// rate limit, shared by every lookup the tab starts.
const lookUp = createLimiter(4);

const chunk = <T>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, (i + 1) * size),
  );

const readGuestBooks = async (): Promise<FinishedBook[]> => {
  const { books, ratings } = await readGuestData();
  const ids = new Set([
    ...Object.keys(books).filter(id => books[id].isRead),
    ...Object.keys(ratings),
  ]);

  return [...ids].map(id => ({
    id,
    authors: books[id]?.book.volumeInfo?.authors ?? [],
    rating: ratings[id],
    hasDoc: false,
  }));
};

const readUserBooks = async (userId: string): Promise<FinishedBook[]> => {
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
  const stored = new Map<string, DocumentData>();
  bookDocs.forEach(snapshot =>
    snapshot.docs.forEach(bookDoc => stored.set(bookDoc.id, bookDoc.data())),
  );

  return ids.map(id => {
    const data = stored.get(id);
    return {
      id,
      authors: data?.volumeInfo?.authors ?? [],
      insights: data?.insights,
      rating: ratings[id],
      hasDoc: !!data,
    };
  });
};

/**
 * Every book the reader has finished, with its authors, genres and the
 * year it first came out, for the Insights tab.
 *
 * Saved books only carry a title, authors and description, so genres come
 * from Google Books and first publication from Open Library. The answer is
 * cached on the book's shared `books/{id}` document — usually ahead of time,
 * when it's ticked as read, rated or imported — so most books arrive ready.
 * Any that don't are looked up one query each, so the tab can show the rest
 * straight away and fill these in as they land; `pendingCount` says how
 * many are still out.
 */
export const useReadingInsightsQuery = () => {
  const { isGuest } = useGuest();
  const userId = auth.currentUser?.uid;

  const finished = useQuery<FinishedBook[]>({
    queryKey: ['readingInsights', isGuest, userId],
    queryFn: async () => {
      if (isGuest) return readGuestBooks();
      return userId ? readUserBooks(userId) : [];
    },
    enabled: isGuest || !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const missing = (finished.data ?? []).filter(book => !book.insights);
  const lookups = useQueries({
    queries: missing.map(book => ({
      queryKey: ['bookInsightsMeta', book.id],
      queryFn: () =>
        lookUp(async () => {
          const fetched = await fetchBookInsightsMeta(book.id);

          // Guests can't write, and a rated book can lack a doc to write to.
          if (!isGuest && book.hasDoc) {
            saveBookInsights(book.id, fetched.meta).catch(error =>
              console.warn('Could not cache book insights:', error),
            );
          }
          return fetched;
        }),
      // A book's genres and first publication don't change.
      staleTime: Infinity,
      gcTime: 30 * 60 * 1000,
      retry: 1,
    })),
  });

  const lookedUp = new Map(
    missing.map((book, i) => [book.id, lookups[i]?.data]),
  );
  const data = finished.data?.map((book): ReadBook => {
    const fetched = lookedUp.get(book.id);
    const meta = book.insights ?? fetched?.meta;

    return {
      id: book.id,
      authors: book.authors.length ? book.authors : (fetched?.authors ?? []),
      categories: meta?.categories ?? [],
      firstPublishYear: meta?.firstPublishYear ?? null,
      rating: book.rating,
    };
  });

  return {
    data,
    isLoading: finished.isLoading,
    isError: finished.isError,
    pendingCount: lookups.filter(lookup => lookup.isPending).length,
  };
};
