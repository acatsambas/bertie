import { useCallback, useEffect, useMemo, useState } from 'react';

import { useUserBooksQuery } from 'api/app/book';

export const useOrderList = () => {
  const [orderList, setOrderList] = useState<string[]>([]);
  const { data, fetchNextPage, hasNextPage, isFetching, refetch } =
    useUserBooksQuery({
      withRefs: true,
    });

  // Update orderList when new pages are loaded
  useEffect(() => {
    if (data?.pages) {
      const newBookIds = data.pages
        .flatMap(page => page.books)
        .filter(book => !book.isRead)
        .map(book => book.id);

      setOrderList(prev => {
        const uniqueIds = new Set([...prev, ...newBookIds]);
        return Array.from(uniqueIds);
      });
    }
  }, [data?.pages]);

  const unreadBooks = useMemo(() => {
    if (!data?.pages) return [];
    const allBooks = data.pages.flatMap(page => page.books);
    return allBooks.filter(book => !book.isRead && orderList.includes(book.id));
  }, [data?.pages, orderList]);

  const removeFromOrder = useCallback((bookId: string) => {
    setOrderList(prev => prev.filter(id => id !== bookId));
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
    fetchMoreBooks,
    loading: isFetching,
    refetch: handleRefetch,
    removeFromOrder,
  };
};
