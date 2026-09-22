import { useCallback, useMemo } from 'react';

import { useUserBooksQuery } from 'api/app/book';
import { useDraftOrder } from 'contexts/DraftOrderContext';

export const useOrderList = () => {
  const { bookIds: orderList, toggleBook: toggleOrder } = useDraftOrder();
  const { data, fetchNextPage, hasNextPage, isFetching, refetch } =
    useUserBooksQuery({
      withRefs: true,
      // Only books still to read can be ordered, and paged together a long
      // Past fills the first pages and leaves this looking empty.
      shelf: 'current',
    });

  const unreadBooks = useMemo(() => {
    if (!data?.pages) return [];
    const allBooks = data.pages.flatMap(page => page.books);
    return allBooks.filter(book => !book.isRead);
  }, [data?.pages]);

  const selectedBooks = useMemo(() => {
    return unreadBooks.filter(book => orderList.includes(book.id));
  }, [unreadBooks, orderList]);

  const fetchMoreBooks = useCallback(() => {
    if (hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    unreadBooks,
    selectedBooks,
    orderList,
    fetchMoreBooks,
    loading: isFetching,
    refetch: handleRefetch,
    toggleOrder,
  };
};
