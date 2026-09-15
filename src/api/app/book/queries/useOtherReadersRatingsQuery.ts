import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';
import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';

import { chunk } from 'utils/chunk';

// Firestore caps an `in` filter at 30 values.
const IN_LIMIT = 30;

/**
 * What other readers rated the given books, keyed by book, leaving out the
 * reader's own ratings: Insights sets the reader's ratings beside them.
 * Off for guests, who can't read other people's ratings.
 */
export const useOtherReadersRatingsQuery = (bookIds: string[]) => {
  const { isGuest } = useGuest();
  const userId = auth.currentUser?.uid;

  return useQuery<Record<string, RatingValue[]>>({
    queryKey: ['otherReadersRatings', userId, bookIds],
    queryFn: async () => {
      const snapshots = await Promise.all(
        chunk(bookIds, IN_LIMIT).map(batch =>
          getDocs(
            query(collection(db, 'ratings'), where('bookId', 'in', batch)),
          ),
        ),
      );

      const byBook: Record<string, RatingValue[]> = {};
      snapshots.forEach(snapshot =>
        snapshot.docs.forEach(rating => {
          const data = rating.data();
          if (data.userId === userId) return;
          (byBook[data.bookId] ??= []).push(data.rating as RatingValue);
        }),
      );
      return byBook;
    },
    enabled: !isGuest && !!userId && bookIds.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
