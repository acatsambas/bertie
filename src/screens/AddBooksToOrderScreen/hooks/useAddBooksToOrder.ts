import { RouteProp, useRoute } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

import { useUserBooksQuery } from 'api/app/book';
import { useBookQuery } from 'api/google-books/useBookQuery';
import { useDraftOrder } from 'contexts/DraftOrderContext';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

export const useAddBooksToOrder = () => {
  const route =
    useRoute<RouteProp<NavigationType, typeof Routes.ORDER_00_ADD_BOOKS>>();
  const bookId = route.params.bookId;
  const { setBooks } = useDraftOrder();

  const { data: initialBook, isLoading: isLoadingInitial } =
    useBookQuery(bookId);

  const { data, fetchNextPage, hasNextPage, isFetching } = useUserBooksQuery({
    withRefs: true,
    // Only books still to read can be added, and paged together a long
    // Past fills the first pages and this screen skips itself.
    shelf: 'current',
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const otherBooks = useMemo(() => {
    if (!data?.pages) return [];
    const allBooks = data.pages.flatMap(page => page.books);
    return allBooks.filter(book => !book.isRead && book.id !== bookId);
  }, [data?.pages, bookId]);

  const hasOtherBooks = otherBooks.length > 0;

  const toggleBook = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedBookIds = useMemo(
    () => [
      bookId,
      ...otherBooks.filter(b => selectedIds.has(b.id)).map(b => b.id),
    ],
    [bookId, otherBooks, selectedIds],
  );

  const commitSelection = useCallback(() => {
    setBooks(selectedBookIds);
  }, [setBooks, selectedBookIds]);

  const fetchMoreBooks = useCallback(() => {
    if (hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  return {
    initialBook,
    otherBooks,
    hasOtherBooks,
    selectedIds,
    toggleBook,
    selectedBookIds,
    commitSelection,
    fetchMoreBooks,
    loading: isFetching || isLoadingInitial,
  };
};
