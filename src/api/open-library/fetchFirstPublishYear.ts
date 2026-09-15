const search = async (params: Record<string, string>) => {
  const query = Object.entries({
    ...params,
    fields: 'first_publish_year',
    limit: '1',
  })
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  const response = await fetch(`https://openlibrary.org/search.json?${query}`);

  if (!response.ok) {
    throw new Error(`Open Library search failed: ${response.status}`);
  }

  const { docs = [] } = await response.json();
  const year = docs[0]?.first_publish_year;
  return typeof year === 'number' ? year : null;
};

/**
 * The year a book first came out. Google Books can't say — its dates belong
 * to the edition, so a 2003 Pride and Prejudice is "2003" — but Open Library
 * groups editions into works and records the earliest. Matched by ISBN where
 * the edition has one, otherwise by title and author; null if it can't tell.
 */
export const fetchFirstPublishYear = async ({
  isbn,
  title,
  author,
}: {
  isbn?: string;
  title?: string;
  author?: string;
}) => {
  if (isbn) {
    const year = await search({ q: `isbn:${isbn}` });
    if (year !== null) return year;
  }

  if (title && author) return search({ title, author });
  return null;
};
