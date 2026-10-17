import { googleBooksFetch } from './request';

export interface BookResult {
  id: string;
  volumeInfo?: {
    authors?: string[];
    description?: string;
    title: string;
  };
}

const MAX_ATTEMPTS = 4;
const RETRY_BASE_MS = 300;

const isRetryableStatus = (status: number) => status === 429 || status >= 500;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Google Books' search backend regularly answers 503 "backendFailed" (or
 * times out) and succeeds on the next try, so one bad response shouldn't
 * become "search failed" on screen.
 */
const fetchVolumes = async (q: string) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&fields=items/volumeInfo/title,items/id,items/volumeInfo/description,items/volumeInfo/authors&orderBy=relevance&maxResults=40&key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`;

  for (let attempt = 1; ; attempt++) {
    const isLastAttempt = attempt === MAX_ATTEMPTS;
    try {
      const response = await googleBooksFetch(url);
      if (response.ok) {
        const data = await response.json();
        return (data.items as BookResult[]) || [];
      }
      if (isLastAttempt || !isRetryableStatus(response.status)) {
        throw new Error(`API request failed with status ${response.status}`);
      }
    } catch (error) {
      // Network failures and timeouts are worth another go; a 4xx isn't.
      const isStatusError =
        error instanceof Error && error.message.startsWith('API request');
      if (isLastAttempt || isStatusError) throw error;
    }
    await wait(RETRY_BASE_MS * 2 ** (attempt - 1));
  }
};

export const searchBooks = async (
  query: string,
  toggleWord: 'intitle' | 'inauthor' = 'intitle',
) => {
  let items = await fetchVolumes(`${toggleWord}:${query}`);

  // A lone `intitle:dune` or `inauthor:tolkien` comes back empty from Google,
  // while the same term also given as free text matches as expected.
  if (items.length === 0) {
    items = await fetchVolumes(`${query} ${toggleWord}:${query}`);
  }

  return items.filter(
    (book, index, self) => index === self.findIndex(b => b.id === book.id),
  );
};
