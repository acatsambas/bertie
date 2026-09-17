import type { RatingValue } from 'api/app/book/mutations/useRateBookMutation';

/** How many readers gave each of Bertie's four ratings, keyed by the rating. */
export type RatingCounts = Partial<Record<`${RatingValue}`, number>>;

export const RATINGS: RatingValue[] = [1, 2, 3, 4];

/** A book everyone must read at least once: the median of its ratings is 4. */
export const ESSENTIAL_MEDIAN = 4;

/**
 * The median of the ratings a tally represents.
 *
 * Deliberately the same answer the old `computeMedian` reached by sorting every
 * rating document: the value at the middle position, or the two middle values
 * rounded. A book's standing must not shift just because the tally replaced the
 * full download.
 */
export const medianFromCounts = (counts: RatingCounts): number | null => {
  const total = RATINGS.reduce((sum, r) => sum + (counts[`${r}`] ?? 0), 0);
  if (total === 0) return null;

  const valueAt = (position: number): RatingValue => {
    let seen = 0;
    for (const rating of RATINGS) {
      seen += counts[`${rating}`] ?? 0;
      if (position < seen) return rating;
    }
    return RATINGS[RATINGS.length - 1];
  };

  // The positions a sorted list of `total` ratings takes its median from.
  const lower = valueAt(Math.floor((total - 1) / 2));
  const upper = valueAt(Math.floor(total / 2));

  return Math.round((lower + upper) / 2);
};

export const applyRatingDelta = (
  counts: RatingCounts,
  previous: RatingValue | null,
  next: RatingValue | null,
): RatingCounts => {
  const updated = { ...counts };

  if (previous) {
    // Books rated before the tally existed have no counts to take from.
    updated[`${previous}`] = Math.max(0, (updated[`${previous}`] ?? 0) - 1);
  }
  if (next) {
    updated[`${next}`] = (updated[`${next}`] ?? 0) + 1;
  }

  return updated;
};
