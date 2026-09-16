import { createLimiter } from 'utils/mapWithLimit';

/**
 * Every Google Books request the app makes.
 *
 * Background work — Insights looking up genres, a Goodreads import, the
 * warm-up after a book is read or rated — can run to hundreds of calls, so it
 * queues here a couple at a time. That keeps it from saturating the app's key
 * and leaving a screen's own request stuck behind it, or hanging Google
 * altogether. Everything gets a timeout, because a request that never settles
 * would otherwise leave a screen loading forever.
 */
const queue = createLimiter(2);
const TIMEOUT_MS = 10_000;

const fetchWithTimeout = async (url: string) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export const googleBooksFetch = (
  url: string,
  { background }: { background?: boolean } = {},
) => (background ? queue(() => fetchWithTimeout(url)) : fetchWithTimeout(url));
