import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';
import { chunk } from 'utils/chunk';

/** Firestore `in` queries accept at most 30 values. */
const IN_LIMIT = 30;

type FetchStoredBooksOptions = {
  /** When true, throw if any id has no `books/{id}` document. */
  requireAll?: boolean;
};

/**
 * Bertie's own copies of books, keyed by Google volume id.
 * Returns results in the same order as `ids`, skipping unknowns unless
 * `requireAll` is set.
 */
export const fetchStoredBooks = async (
  ids: string[],
  { requireAll = false }: FetchStoredBooksOptions = {},
): Promise<BookResult[]> => {
  if (!ids.length) return [];

  const uniqueIds = [...new Set(ids)];
  const snapshots = await Promise.all(
    chunk(uniqueIds, IN_LIMIT).map(batch =>
      getDocs(query(collection(db, 'books'), where(documentId(), 'in', batch))),
    ),
  );

  const byId = new Map<string, BookResult>();
  for (const snapshot of snapshots) {
    for (const bookDoc of snapshot.docs) {
      byId.set(bookDoc.id, {
        id: bookDoc.id,
        ...bookDoc.data(),
      } as BookResult);
    }
  }

  if (requireAll) {
    const missing = uniqueIds.filter(id => !byId.has(id));
    if (missing.length > 0) {
      throw new Error(`Missing stored books: ${missing.join(', ')}`);
    }
    return ids.map(id => byId.get(id)!);
  }

  return ids.flatMap(id => {
    const book = byId.get(id);
    return book ? [book] : [];
  });
};
