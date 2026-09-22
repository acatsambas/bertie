import { useQuery } from '@tanstack/react-query';

import { fetchStoredBooks } from 'api/app/book/fetchStoredBooks';
import { BookResult } from 'api/google-books/search';

export const useBooksQuery = ({ ids }: { ids: string[] } = { ids: [] }) => {
  return useQuery<BookResult[]>({
    queryKey: ['books', ids],
    queryFn: () => fetchStoredBooks(ids),
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
