import { useQuery } from '@tanstack/react-query';

import { fetchBook } from './fetchBook';

export const useBookQuery = (bookId: string) => {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: () => fetchBook(bookId),
    staleTime: 1000 * 60 * 60, // 1 hour — book metadata rarely changes
    // Google hands out the odd 503 when it's busy, and without the book
    // this screen has nothing to show, so keep trying for a while.
    retry: 4,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 8000),
  });
};
