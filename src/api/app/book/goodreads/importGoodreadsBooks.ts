import {
  DocumentData,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

import { db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';

import { mapWithLimit } from 'utils/mapWithLimit';

import { findGoogleBook } from './findGoogleBook';
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

// Google lookups run a couple at a time: faster than one by one, gentle
// enough that retries rarely kick in.
const CONCURRENT_BOOKS = 2;

const saveBook = async (
  userId: string,
  found: BookResult,
  book: GoodreadsBook,
  entry: DocumentData | undefined,
  alreadyRated: boolean,
): Promise<Outcome> => {
  const bookRef = doc(db, 'books', found.id);
  if (!(await getDoc(bookRef)).exists()) await setDoc(bookRef, found);

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
      const found = await findGoogleBook(book);

      if (!found) {
        result.missed.push(book);
      } else if (seen.has(found.id)) {
        // Two editions of one book on Goodreads, one volume on Google.
        result.unchanged += 1;
      } else {
        seen.add(found.id);
        result[
          await saveBook(
            userId,
            found,
            book,
            existing.get(found.id),
            rated.has(found.id),
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
