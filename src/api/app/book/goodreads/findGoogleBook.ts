import { BookResult } from 'api/google-books/search';

import { GoodreadsBook } from './parseGoodreadsCsv';

interface Volume {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
  };
}

const FIELDS =
  'items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/description,volumeInfo/industryIdentifiers)';
const RETRYABLE = [429, 500, 503];
const MAX_ATTEMPTS = 4;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// A burst of lookups gets the odd 503 from Google; a pause and a retry
// clears it.
const searchVolumes = async (q: string): Promise<Volume[]> => {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&fields=${FIELDS}&maxResults=10&key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`,
    );

    if (response.ok) return (await response.json()).items ?? [];
    if (!RETRYABLE.includes(response.status) || attempt === MAX_ATTEMPTS) {
      throw new Error(`Google Books search failed: ${response.status}`);
    }
    await sleep(1000 * attempt);
  }
};

/** ISBN-10 to ISBN-13, so either form compares against the other. */
export const toIsbn13 = (isbn: string) => {
  if (isbn.length !== 10) return isbn;
  const core = `978${isbn.slice(0, 9)}`;
  const sum = [...core].reduce(
    (total, digit, i) => total + Number(digit) * (i % 2 ? 3 : 1),
    0,
  );
  return `${core}${(10 - (sum % 10)) % 10}`;
};

export const hasIsbn = (volume: Volume, isbn: string) =>
  (volume.volumeInfo?.industryIdentifiers ?? []).some(
    ({ identifier }) =>
      toIsbn13(identifier.replace(/[^0-9X]/gi, '').toUpperCase()) ===
      toIsbn13(isbn),
  );

const normalise = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** "Leviathan Wakes (The Expanse, #1)" is plain "Leviathan Wakes" off Goodreads. */
export const searchableTitle = (title: string) =>
  title.replace(/\s*\([^)]*#[^)]*\)\s*$/, '').trim();

// Compare the main title only: Goodreads puts subtitles after a colon, Google
// keeps them in a separate field.
const mainTitle = (title: string) => normalise(title.split(':')[0]);

export const matchesTitleAndAuthor = (
  volume: Volume,
  title: string,
  author: string,
) => {
  const surname = normalise(author).split(' ').pop();

  return (
    !!surname &&
    mainTitle(volume.volumeInfo?.title ?? '') ===
      mainTitle(searchableTitle(title)) &&
    (volume.volumeInfo?.authors ?? []).some(name =>
      normalise(name).split(' ').includes(surname),
    )
  );
};

// Shaped like a search result, which is what the rest of the app stores.
// Firestore rejects undefined, so missing fields are left out.
const toBookResult = ({ id, volumeInfo = {} }: Volume): BookResult => ({
  id,
  volumeInfo: {
    title: volumeInfo.title ?? '',
    ...(volumeInfo.authors ? { authors: volumeInfo.authors } : {}),
    ...(volumeInfo.description ? { description: volumeInfo.description } : {}),
  },
});

/**
 * The Google Books volume for a Goodreads row: by ISBN where it has one,
 * only accepting a volume that carries that ISBN; otherwise, or if that
 * fails, by title and author, only accepting an exact title and author match.
 */
export const findGoogleBook = async (
  book: GoodreadsBook,
): Promise<BookResult | null> => {
  for (const isbn of book.isbns) {
    const match = (await searchVolumes(`isbn:${isbn}`)).find(volume =>
      hasIsbn(volume, isbn),
    );
    if (match) return toBookResult(match);
  }

  const title = searchableTitle(book.title);
  if (!title || !book.author) return null;

  const match = (
    await searchVolumes(`intitle:"${title}" inauthor:"${book.author}"`)
  ).find(volume => matchesTitleAndAuthor(volume, title, book.author));
  return match ? toBookResult(match) : null;
};
