import { useCallback, useEffect, useMemo, useState } from 'react';

import { RouteProp, useRoute } from '@react-navigation/native';

import { useUserBooksQuery } from 'api/app/book';
import { UserBook } from 'api/app/types';
import { BookResult } from 'api/google-books/search';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

export const useAddBooksToOrder = () => {
    const route =
        useRoute<RouteProp<NavigationType, typeof Routes.ORDER_00_ADD_BOOKS>>();
    const initialBook = route.params.initialBook;

    const { data, fetchNextPage, hasNextPage, isFetching } = useUserBooksQuery({
        withRefs: true,
    });

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const otherBooks = useMemo(() => {
        if (!data?.pages) return [];
        const allBooks = data.pages.flatMap(page => page.books);
        return allBooks.filter(book => !book.isRead && book.id !== initialBook.id);
    }, [data?.pages, initialBook.id]);

    const hasOtherBooks = otherBooks.length > 0;

    const toggleBook = useCallback((bookId: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(bookId)) {
                next.delete(bookId);
            } else {
                next.add(bookId);
            }
            return next;
        });
    }, []);

    const selectedBooks = useMemo(() => {
        const initialAsOrderBook = {
            ...initialBook,
            bookRef: undefined as any,
            isRead: false,
        } as UserBook & BookResult;

        const additionalBooks = otherBooks.filter(book =>
            selectedIds.has(book.id),
        );

        return [initialAsOrderBook, ...additionalBooks];
    }, [initialBook, otherBooks, selectedIds]);

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
        selectedBooks,
        fetchMoreBooks,
        loading: isFetching,
    };
};
