import {
  DocumentSnapshot,
  Transaction,
  doc,
  runTransaction,
} from 'firebase/firestore';

import type { RatingValue } from 'api/app/book/mutations/useRateBookMutation';
import {
  ESSENTIAL_MEDIAN,
  RatingCounts,
  applyRatingDelta,
  medianFromCounts,
} from 'api/app/book/ratingMedian';
import { db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';

const readCounts = (snapshot: DocumentSnapshot): RatingCounts => ({
  ...((snapshot.data()?.ratingCounts as RatingCounts | undefined) ?? {}),
});

/**
 * Write a reader's rating and keep the book's tally in step with it.
 *
 * Discover's essential reads used to be worked out by downloading every rating
 * document in the database and taking a median per book — every visit, to pick
 * ten books. The tally lives on the book instead, so Discover can ask for the
 * ten books already marked essential.
 *
 * Both sides move in one transaction: a rating that lands without its tally
 * would quietly drop a book off Discover, and the read of the previous rating
 * has to see the same instant as the write that replaces it, or two readers
 * rating at once lose a vote between them.
 *
 * `rating` of null takes the reader's rating off.
 */
export const writeRatingWithStats = async ({
  bookId,
  userId,
  rating,
  book,
}: {
  bookId: string;
  userId: string;
  rating: RatingValue | null;
  book?: BookResult;
}) =>
  runTransaction(db, async (transaction: Transaction) => {
    const ratingRef = doc(db, 'ratings', `${bookId}_${userId}`);
    const bookRef = doc(db, 'books', bookId);

    const ratingSnapshot = await transaction.get(ratingRef);
    const bookSnapshot = await transaction.get(bookRef);

    const previous = ratingSnapshot.exists()
      ? ((ratingSnapshot.data().rating as RatingValue) ?? null)
      : null;

    if (previous === rating) return;

    const counts = applyRatingDelta(readCounts(bookSnapshot), previous, rating);
    const stats = {
      ratingCounts: counts,
      essential: medianFromCounts(counts) === ESSENTIAL_MEDIAN,
    };

    if (bookSnapshot.exists()) {
      transaction.update(bookRef, stats);
    } else {
      // Seed the shared document so Discover has something to show for it.
      transaction.set(bookRef, book ? { ...book, ...stats } : stats, {
        merge: true,
      });
    }

    if (rating === null) {
      transaction.delete(ratingRef);
    } else {
      transaction.set(ratingRef, { bookId, userId, rating });
    }
  });
