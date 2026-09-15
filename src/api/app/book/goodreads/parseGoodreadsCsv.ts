import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';

/** One row of a Goodreads export, mapped onto what Bertie keeps. */
export interface GoodreadsBook {
  title: string;
  author: string;
  /** ISBN-13 first, then ISBN-10. Often empty for ebook editions. */
  isbns: string[];
  /** On the Read shelf, so it goes into Past; anything else goes into Current. */
  isRead: boolean;
  rating?: RatingValue;
  addedAt?: number;
  readAt?: number;
}

export class NotGoodreadsExportError extends Error {}

const REQUIRED_COLUMNS = [
  'Title',
  'Author',
  'ISBN',
  'ISBN13',
  'My Rating',
  'Date Read',
  'Date Added',
  'Exclusive Shelf',
];

// Goodreads rates out of 5 and leaves 0 for unrated. Bertie's 4 — essential
// reading — is left for the reader to give.
const RATINGS: Record<string, RatingValue> = {
  '1': 1,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 3,
};

/** RFC 4180: quoted fields can hold commas, line breaks and doubled quotes. */
export const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (quoted) {
      if (char !== '"') field += char;
      else if (text[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = false;
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter(cells => cells.some(cell => cell.trim()));
};

/**
 * Goodreads writes ISBNs as ="0141439513" so spreadsheets keep the leading
 * zero. Placeholders like 0000000000 match junk records on Google, so they're
 * treated as no ISBN at all.
 */
export const cleanIsbn = (raw: string) => {
  const isbn = raw.replace(/[^0-9X]/gi, '').toUpperCase();
  if (isbn.length !== 10 && isbn.length !== 13) return null;
  if (/^(.)\1+$/.test(isbn)) return null;
  return isbn;
};

/** "2023/05/14", as Goodreads writes it, to epoch ms at local midnight. */
export const parseGoodreadsDate = (raw: string) => {
  const match = raw.trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!match) return undefined;
  const [, year, month, day] = match.map(Number);
  return new Date(year, month - 1, day).getTime();
};

export const parseGoodreadsCsv = (text: string): GoodreadsBook[] => {
  const [header, ...rows] = parseCsv(text.replace(/^﻿/, ''));
  const column = new Map((header ?? []).map((name, i) => [name.trim(), i]));

  if (REQUIRED_COLUMNS.some(name => !column.has(name))) {
    throw new NotGoodreadsExportError();
  }

  const cell = (row: string[], name: string) =>
    (row[column.get(name)!] ?? '').trim();

  return rows
    .map(row => {
      const isRead = cell(row, 'Exclusive Shelf') === 'read';
      const rating = RATINGS[cell(row, 'My Rating')];
      const addedAt = parseGoodreadsDate(cell(row, 'Date Added'));
      const readAt = isRead
        ? parseGoodreadsDate(cell(row, 'Date Read'))
        : undefined;

      return {
        title: cell(row, 'Title'),
        author: cell(row, 'Author'),
        isbns: [cleanIsbn(cell(row, 'ISBN13')), cleanIsbn(cell(row, 'ISBN'))]
          .filter((isbn): isbn is string => !!isbn)
          .filter((isbn, i, all) => all.indexOf(isbn) === i),
        isRead,
        ...(rating ? { rating } : {}),
        ...(addedAt ? { addedAt } : {}),
        ...(readAt ? { readAt } : {}),
      };
    })
    .filter(book => book.title);
};
