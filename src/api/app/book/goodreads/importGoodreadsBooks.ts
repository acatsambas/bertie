import {
  DocumentData,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from 'api/firebase';
import { insightsMetaFromVolume } from 'api/google-books/fetchBookInsightsMeta';

import { mapWithLimit } from 'utils/mapWithLimit';

import { Volume, findGoogleVolume, toBookResult } from './findGoogleBook';
import { GoodreadsBook } from './parseGoodreadsCsv';

export interface GoodreadsImportResult {
  added: number;
  /** Already on the list, with something filled in: read, a date, a rating. */
  updated: number;
  /** Already on the list with nothing to add, or in the file twice. */
  unchanged: number;
  /** Rows we couldn't match to a Google Books volume, or couldn't save. */
  missed: GoodreadsBook[];
}

type Outcome = 'added' | 'updated' | 'unchanged';

// A few books at a time: faster than one by one, gentle enough on Google
// that retries rarely kick in.
const CONCURRENT_BOOKS = 3;

const saveBook = async (
  userId: string,
  volume: Volume,
  book: GoodreadsBook,
  entry: DocumentData | undefined,
  alreadyRated: boolean,
): Promise<Outcome> => {
  const found = toBookResult(volume);
  const bookRef = doc(db, 'books', found.id);
  const snapshot = await getDoc(bookRef);

  // Ready finished books for Insights now, while Google's answer is in hand,
  // so the Insights tab doesn't have to look them up. If Open Library lets
  // us down, Insights tries again itself.
  const insights =
    (book.isRead || book.rating) && !snapshot.data()?.insights
      ? await insightsMetaFromVolume(volume.volumeInfo ?? {}).catch(() => null)
      : null;

  if (!snapshot.exists()) {
    await setDoc(bookRef, { ...found, ...(insights ? { insights } : {}) });
  } else if (insights) {
    await updateDoc(bookRef, { insights });
  }

  const userBookRef = doc(db, 'users', userId, 'books', found.id);
  const readAt =
    book.isRead && book.readAt ? Timestamp.fromMillis(book.readAt) : null;
  let outcome: Outcome = 'unchanged';

  if (!entry) {
    await setDoc(userBookRef, {
      bookRef,
      isRead: book.isRead,
      addedAt: Timestamp.fromMillis(book.addedAt ?? Date.now()),
      ...(readAt ? { readAt } : {}),
    });
    outcome = 'added';
  } else {
    // Only fill gaps: never un-read a book or move a date it already has.
    const changes = {
      ...(book.isRead && !entry.isRead ? { isRead: true } : {}),
      ...(readAt && !entry.readAt ? { readAt } : {}),
      ...(book.addedAt && !entry.addedAt
        ? { addedAt: Timestamp.fromMillis(book.addedAt) }
        : {}),
    };
    if (Object.keys(changes).length) {
      await setDoc(userBookRef, changes, { merge: true });
      outcome = 'updated';
    }
  }

  // A rating given in Bertie always wins over one from Goodreads.
  if (book.rating && !alreadyRated) {
    await setDoc(doc(db, 'ratings', `${found.id}_${userId}`), {
      bookId: found.id,
      userId,
      rating: book.rating,
    });
    if (outcome === 'unchanged') outcome = 'updated';
  }

  return outcome;
};

/**
 * Brings a parsed Goodreads export into the reader's list: each row matched
 * to a Google Books volume, read books into Past and the rest into Current.
 */
export const importGoodreadsBooks = async (
  books: GoodreadsBook[],
  userId: string,
  onProgress: (done: number) => void,
): Promise<GoodreadsImportResult> => {
  const [entries, ratings] = await Promise.all([
    getDocs(collection(db, 'users', userId, 'books')),
    getDocs(query(collection(db, 'ratings'), where('userId', '==', userId))),
  ]);
  const existing = new Map(entries.docs.map(entry => [entry.id, entry.data()]));
  const rated = new Set(ratings.docs.map(rating => rating.data().bookId));
  const seen = new Set<string>();
  const result: GoodreadsImportResult = {
    added: 0,
    updated: 0,
    unchanged: 0,
    missed: [],
  };
  let done = 0;

  await mapWithLimit(books, CONCURRENT_BOOKS, async book => {
    try {
      const volume = await findGoogleVolume(book);

      if (!volume) {
        result.missed.push(book);
      } else if (seen.has(volume.id)) {
        // Two editions of one book on Goodreads, one volume on Google.
        result.unchanged += 1;
      } else {
        seen.add(volume.id);
        result[
          await saveBook(
            userId,
            volume,
            book,
            existing.get(volume.id),
            rated.has(volume.id),
          )
        ] += 1;
      }
    } catch (error) {
      console.warn('Could not import from Goodreads:', book.title, error);
      result.missed.push(book);
    }

    onProgress(++done);
  });

  return result;
};
