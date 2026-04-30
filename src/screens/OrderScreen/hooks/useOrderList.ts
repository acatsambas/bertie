import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUserBooksQuery } from 'api/app/book';

export const useOrderList = () => {
  const [orderList, setOrderList] = useState<string[]>([]);
  const { data, fetchNextPage, hasNextPage, isFetching, refetch } =
    useUserBooksQuery({
      withRefs: true,
    });

  const unreadBooks = useMemo(() => {
    if (!data?.pages) return [];
    const allBooks = data.pages.flatMap(page => page.books);
    return allBooks.filter(book => !book.isRead);
  }, [data?.pages]);

  const selectedBooks = useMemo(() => {
    return unreadBooks.filter(book => orderList.includes(book.id));
  }, [unreadBooks, orderList]);

  const toggleOrder = useCallback((bookId: string) => {
    setOrderList(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      }
      return [...prev, bookId];
    });
  }, []);

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
