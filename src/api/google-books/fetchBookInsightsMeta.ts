import { fetchFirstPublishYear } from 'api/open-library/fetchFirstPublishYear';

/** What Insights needs about a book that a saved book doesn't carry. */
export interface BookInsightsMeta {
  /** BISAC paths, e.g. "Fiction / Science Fiction / General". */
  categories: string[];
  /** When the work first came out, not this edition; null if unknown. */
  firstPublishYear: number | null;
}

/** The parts of a Google Books volume Insights reads. */
export interface InsightsVolumeInfo {
  title?: string;
  authors?: string[];
  categories?: string[];
  industryIdentifiers?: { type: string; identifier: string }[];
}

/** Genres from a Google Books volume, first publication from Open Library. */
export const insightsMetaFromVolume = async (
  volumeInfo: InsightsVolumeInfo,
): Promise<BookInsightsMeta> => {
  const identifiers = volumeInfo.industryIdentifiers ?? [];
  const isbn = ['ISBN_13', 'ISBN_10']
    .map(type => identifiers.find(id => id.type === type)?.identifier)
    .find(Boolean);

  return {
    categories: volumeInfo.categories ?? [],
    firstPublishYear: await fetchFirstPublishYear({
      isbn,
      title: volumeInfo.title,
      author: volumeInfo.authors?.[0],
    }),
  };
};

export const fetchBookInsightsMeta = async (
  bookId: string,
): Promise<{ authors: string[]; meta: BookInsightsMeta }> => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?fields=volumeInfo/title,volumeInfo/authors,volumeInfo/categories,volumeInfo/industryIdentifiers&key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch book ${bookId}: ${response.status}`);
  }

  const { volumeInfo = {} } = await response.json();

  return {
    authors: volumeInfo.authors ?? [],
    meta: await insightsMetaFromVolume(volumeInfo),
  };
};
