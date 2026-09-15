import { ReadBook } from 'api/app/book/queries/useReadingInsightsQuery';

export interface InsightGroup {
  label: string;
  readCount: number;
  ratedCount: number;
  /** Out of 4; null when none of its books are rated. */
  avgRating: number | null;
}

export type Ranking = 'mostRead' | 'topRated';
export type Kind = 'fiction' | 'nonFiction';

export interface ReadingInsights {
  readCount: number;
  ratedCount: number;
  avgRating: number | null;
  authors: InsightGroup[];
  genres: InsightGroup[];
  decades: InsightGroup[];
  fiction: InsightGroup;
  nonFiction: InsightGroup;
  /** Books Google gave no categories for, so neither fiction nor non-fiction. */
  unclassifiedCount: number;
}

// Top-level BISAC sections that count as fiction. Poetry and drama aren't
// strictly fiction, but they sit far closer to it than to non-fiction.
const FICTION_SECTIONS = new Set([
  'fiction',
  'juvenile fiction',
  'young adult fiction',
  'comics & graphic novels',
  'drama',
  'poetry',
]);

// Names that read better as a genre than BISAC's own.
const GENRE_NAMES: Record<string, string> = {
  Literary: 'Literary Fiction',
  'Juvenile Fiction': "Children's Fiction",
  'Juvenile Nonfiction': "Children's Non-fiction",
  'Young Adult Nonfiction': 'Young Adult Non-fiction',
};

const sections = (category: string) =>
  category
    .split('/')
    .map(part => part.trim())
    .filter(part => part && part !== 'General');

export const kindOf = (book: ReadBook): Kind | null => {
  if (!book.categories.length) return null;

  return book.categories.some(category =>
    FICTION_SECTIONS.has((sections(category)[0] ?? '').toLowerCase()),
  )
    ? 'fiction'
    : 'nonFiction';
};

/**
 * "History / Europe / General" is History, but "Fiction / Science Fiction"
 * is Science Fiction: every fiction book shares the top section, and the
 * fiction split already covers it.
 */
export const genreOf = (category: string) => {
  const [section, subject] = sections(category);
  if (!section) return null;

  const genre = section === 'Fiction' && subject ? subject : section;
  return GENRE_NAMES[genre] ?? genre;
};

/** Books with no known first publication are left out, never guessed. */
export const decadeOf = (year: number | null) =>
  year === null ? null : `${Math.floor(year / 10) * 10}s`;

const groupBooks = (
  books: ReadBook[],
  keysOf: (book: ReadBook) => (string | null)[],
): InsightGroup[] => {
  const groups = new Map<
    string,
    { readCount: number; ratedCount: number; ratingSum: number }
  >();

  books.forEach(book => {
    // A book listed under the same genre twice still counts once.
    new Set(keysOf(book)).forEach(key => {
      if (!key) return;
      const group = groups.get(key) ?? {
        readCount: 0,
        ratedCount: 0,
        ratingSum: 0,
      };
      group.readCount += 1;
      if (book.rating) {
        group.ratedCount += 1;
        group.ratingSum += book.rating;
      }
      groups.set(key, group);
    });
  });

  return [...groups].map(([label, { readCount, ratedCount, ratingSum }]) => ({
    label,
    readCount,
    ratedCount,
    avgRating: ratedCount ? ratingSum / ratedCount : null,
  }));
};

const emptyGroup = (label: string): InsightGroup => ({
  label,
  readCount: 0,
  ratedCount: 0,
  avgRating: null,
});

export const computeInsights = (books: ReadBook[]): ReadingInsights => {
  const kinds = groupBooks(books, book => [kindOf(book)]);
  const rated = books.filter(book => book.rating);

  return {
    readCount: books.length,
    ratedCount: rated.length,
    avgRating: rated.length
      ? rated.reduce((sum, book) => sum + book.rating!, 0) / rated.length
      : null,
    authors: groupBooks(books, book => book.authors.map(name => name.trim())),
    genres: groupBooks(books, book => book.categories.map(genreOf)),
    decades: groupBooks(books, book => [decadeOf(book.firstPublishYear)]),
    fiction:
      kinds.find(group => group.label === 'fiction') ?? emptyGroup('fiction'),
    nonFiction:
      kinds.find(group => group.label === 'nonFiction') ??
      emptyGroup('nonFiction'),
    unclassifiedCount: books.filter(book => !kindOf(book)).length,
  };
};

const byReads = (a: InsightGroup, b: InsightGroup) =>
  b.readCount - a.readCount ||
  (b.avgRating ?? 0) - (a.avgRating ?? 0) ||
  a.label.localeCompare(b.label);

const byRating = (a: InsightGroup, b: InsightGroup) =>
  b.avgRating! - a.avgRating! ||
  b.ratedCount - a.ratedCount ||
  b.readCount - a.readCount ||
  a.label.localeCompare(b.label);

// One glowing review doesn't make a favourite author or genre.
export const MIN_RATED_FOR_TOP = 2;

/** The top `limit` groups; "top rated" only counts groups rated enough. */
export const rank = (groups: InsightGroup[], ranking: Ranking, limit = 5) =>
  ranking === 'topRated'
    ? groups
        .filter(group => group.ratedCount >= MIN_RATED_FOR_TOP)
        .sort(byRating)
        .slice(0, limit)
    : [...groups].sort(byReads).slice(0, limit);

// --- summary ---------------------------------------------------------------

export type SummaryId =
  | 'only'
  | 'mostly'
  | 'mostlyAlsoHigher'
  | 'mostlyOtherHigher'
  | 'evenSplit'
  | 'evenSplitHigher'
  | 'authorSame'
  | 'authorDiff'
  | 'authorGoTo'
  | 'authorTop'
  | 'genreSame'
  | 'genreDiff'
  | 'genreGoTo'
  | 'genreTop';

export interface SummaryLine {
  id: SummaryId;
  values?: Record<string, string>;
}

/**
 * The group read most — but only when that means something: read more than
 * once, and more than any other. Plus the highest-rated group, which is the
 * go-to one whenever the two tie on rating.
 */
const favourites = (groups: InsightGroup[]) => {
  const [first, second] = rank(groups, 'mostRead', 2);
  const goTo =
    first && first.readCount >= 2 && first.readCount > (second?.readCount ?? 0)
      ? first
      : undefined;
  const [best] = rank(groups, 'topRated', 1);
  const topRated =
    goTo && best && goTo.avgRating === best.avgRating ? goTo : best;

  return { goTo, topRated };
};

const fictionLine = (
  { fiction, nonFiction }: ReadingInsights,
  kindName: (kind: Kind) => string,
): SummaryLine | null => {
  if (!fiction.readCount && !nonFiction.readCount) return null;

  const group = { fiction, nonFiction };
  const higher: Kind | null =
    fiction.avgRating !== null &&
    nonFiction.avgRating !== null &&
    fiction.avgRating !== nonFiction.avgRating
      ? fiction.avgRating > nonFiction.avgRating
        ? 'fiction'
        : 'nonFiction'
      : null;

  if (fiction.readCount === nonFiction.readCount) {
    return higher
      ? { id: 'evenSplitHigher', values: { higher: kindName(higher) } }
      : { id: 'evenSplit' };
  }

  const mostly: Kind =
    fiction.readCount > nonFiction.readCount ? 'fiction' : 'nonFiction';
  const other: Kind = mostly === 'fiction' ? 'nonFiction' : 'fiction';
  const values = { mostly: kindName(mostly), other: kindName(other) };

  if (!group[other].readCount) return { id: 'only', values };
  if (!higher) return { id: 'mostly', values };
  return {
    id: higher === mostly ? 'mostlyAlsoHigher' : 'mostlyOtherHigher',
    values,
  };
};

const favouritesLine = (
  groups: InsightGroup[],
  ids: { same: SummaryId; diff: SummaryId; goTo: SummaryId; top: SummaryId },
): SummaryLine | null => {
  const { goTo, topRated } = favourites(groups);

  if (goTo && topRated) {
    return goTo === topRated
      ? { id: ids.same, values: { top: topRated.label } }
      : { id: ids.diff, values: { goTo: goTo.label, top: topRated.label } };
  }
  if (goTo) return { id: ids.goTo, values: { goTo: goTo.label } };
  if (topRated) return { id: ids.top, values: { top: topRated.label } };
  return null;
};

/** The sentences that open the tab, as translation ids and their values. */
export const summarise = (
  insights: ReadingInsights,
  kindName: (kind: Kind) => string,
): SummaryLine[] =>
  [
    fictionLine(insights, kindName),
    favouritesLine(insights.authors, {
      same: 'authorSame',
      diff: 'authorDiff',
      goTo: 'authorGoTo',
      top: 'authorTop',
    }),
    favouritesLine(insights.genres, {
      same: 'genreSame',
      diff: 'genreDiff',
      goTo: 'genreGoTo',
      top: 'genreTop',
    }),
  ].filter((line): line is SummaryLine => line !== null);
