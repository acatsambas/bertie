import { useQuery } from '@tanstack/react-query';

import { fetchBook } from './fetchBook';

export const useBookQuery = (bookId: string) => {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: () => fetchBook(bookId),
    staleTime: 1000 * 60 * 60, // 1 hour — book metadata rarely changes
  });
};
