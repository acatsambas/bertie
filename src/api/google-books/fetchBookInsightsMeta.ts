import { fetchFirstPublishYear } from 'api/open-library/fetchFirstPublishYear';

/** What Insights needs about a book that a saved book doesn't carry. */
export interface BookInsightsMeta {
  /** BISAC paths, e.g. "Fiction / Science Fiction / General". */
  categories: string[];
  /** When the work first came out, not this edition; null if unknown. */
  firstPublishYear: number | null;
}

type IndustryIdentifier = { type: string; identifier: string };

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
  const authors: string[] = volumeInfo.authors ?? [];
  const identifiers: IndustryIdentifier[] =
    volumeInfo.industryIdentifiers ?? [];
  const isbn = ['ISBN_13', 'ISBN_10']
    .map(type => identifiers.find(id => id.type === type)?.identifier)
    .find(Boolean);

  return {
    authors,
    meta: {
      categories: volumeInfo.categories ?? [],
      firstPublishYear: await fetchFirstPublishYear({
        isbn,
        title: volumeInfo.title,
        author: authors[0],
      }),
    },
  };
};
