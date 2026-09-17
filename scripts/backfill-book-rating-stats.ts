/**
 * Seed every book's rating tally, so Discover can ask for essential reads
 * instead of working them out from every rating in the database.
 *
 * Discover used to download all of `ratings` on each visit and take a median
 * per book. Ratings now keep a `ratingCounts` tally and an `essential` flag on
 * the book itself; the books rated before that existed have neither, so this
 * walks the ratings once and writes what those books have been owed.
 *
 * Safe to re-run: it recomputes each tally from scratch rather than adding to
 * whatever is already there. Prints what it would do unless given --write.
 *
 * Usage:
 *   npx tsx scripts/backfill-book-rating-stats.ts /path/to/service-account.json
 *   npx tsx scripts/backfill-book-rating-stats.ts /path/to/key.json --write
 */
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/** Bertie rates out of 4; a book is essential when the median lands on 4. */
const RATINGS = [1, 2, 3, 4] as const;
const ESSENTIAL_MEDIAN = 4;
const BATCH_SIZE = 400;

const args = process.argv.slice(2);
const credentialPath = args.find(arg => !arg.startsWith('--'));
const write = args.includes('--write');

if (getApps().length === 0) {
  initializeApp(
    credentialPath ? { credential: cert(credentialPath) } : undefined,
  );
}

const db = getFirestore();

type Counts = Record<string, number>;

/**
 * The same median `medianFromCounts` computes in the app, and the same one the
 * old client-side `computeMedian` reached by sorting: the middle rating, or the
 * two middle ratings rounded.
 */
const medianFromCounts = (counts: Counts): number | null => {
  const total = RATINGS.reduce((sum, r) => sum + (counts[r] ?? 0), 0);
  if (total === 0) return null;

  const valueAt = (position: number): number => {
    let seen = 0;
    for (const rating of RATINGS) {
      seen += counts[rating] ?? 0;
      if (position < seen) return rating;
    }
    return RATINGS[RATINGS.length - 1];
  };

  return Math.round(
    (valueAt(Math.floor((total - 1) / 2)) + valueAt(Math.floor(total / 2))) / 2,
  );
};

const run = async () => {
  const ratings = await db.collection('ratings').get();

  const byBook = new Map<string, Counts>();
  let skipped = 0;

  ratings.forEach(doc => {
    const { bookId, rating } = doc.data() as {
      bookId?: string;
      rating?: number;
    };
    if (
      !bookId ||
      !rating ||
      !RATINGS.includes(rating as (typeof RATINGS)[number])
    ) {
      skipped++;
      return;
    }
    const counts = byBook.get(bookId) ?? {};
    counts[rating] = (counts[rating] ?? 0) + 1;
    byBook.set(bookId, counts);
  });

  console.log(
    `${ratings.size} ratings over ${byBook.size} books` +
      (skipped ? ` (${skipped} unusable, ignored)` : ''),
  );

  // A rating can name a book that was never cached. Writing a tally onto one
  // would create a document with no volumeInfo, which Discover would then show
  // as a book with no title, so leave those alone.
  const bookIds = [...byBook.keys()];
  const existing = new Set<string>();

  for (let i = 0; i < bookIds.length; i += 300) {
    const refs = bookIds.slice(i, i + 300).map(id => db.doc(`books/${id}`));
    const snapshots = await db.getAll(...refs);
    snapshots.forEach(snapshot => snapshot.exists && existing.add(snapshot.id));
  }

  const missing = bookIds.length - existing.size;
  const updates = [...byBook.entries()]
    .filter(([bookId]) => existing.has(bookId))
    .map(([bookId, counts]) => ({
      bookId,
      counts,
      essential: medianFromCounts(counts) === ESSENTIAL_MEDIAN,
    }));

  const essential = updates.filter(u => u.essential);

  console.log(
    `${updates.length} books to update` +
      (missing ? `, ${missing} rated books with no document (left alone)` : ''),
  );
  console.log(`${essential.length} qualify as essential reads:`);
  essential
    .slice(0, 15)
    .forEach(({ bookId, counts }) =>
      console.log(`  ${bookId}  ${JSON.stringify(counts)}`),
    );

  if (!write) {
    console.log('\nDry run. Pass --write to apply.');
    return;
  }

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = db.batch();
    updates
      .slice(i, i + BATCH_SIZE)
      .forEach(({ bookId, counts, essential: isEssential }) =>
        batch.update(db.doc(`books/${bookId}`), {
          ratingCounts: counts,
          essential: isEssential,
        }),
      );
    await batch.commit();
    console.log(
      `written ${Math.min(i + BATCH_SIZE, updates.length)}/${updates.length}`,
    );
  }

  console.log('Done.');
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
