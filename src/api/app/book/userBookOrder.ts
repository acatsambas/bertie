/**
 * Ordering for the books on someone's list: newest first, by when a book was
 * added for what they're reading now, and by when it was ticked for what
 * they've read.
 */

/** A Firestore Timestamp, or epoch ms from guest storage, as epoch ms. */
export const toMillis = (value: unknown): number | undefined => {
  if (typeof value === 'number') return value;
  if (typeof (value as { toMillis?: unknown })?.toMillis === 'function') {
    return (value as { toMillis(): number }).toMillis();
  }
  return undefined;
};

interface DatedBook {
  isRead?: boolean;
  addedAt?: number;
  readAt?: number;
}

const listDate = (book: DatedBook) =>
  book.isRead ? book.readAt : book.addedAt;

/**
 * Newest first. Books put on a list before these dates were tracked have
 * none, so they go after every dated book, in their existing order.
 */
export const byListDateDesc = (a: DatedBook, b: DatedBook) => {
  const aDate = listDate(a);
  const bDate = listDate(b);

  if (aDate === undefined && bDate === undefined) return 0;
  if (aDate === undefined) return 1;
  if (bDate === undefined) return -1;
  return bDate - aDate;
};
