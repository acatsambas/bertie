import { useInfiniteQuery } from '@tanstack/react-query';
import { collection, getDoc, getDocs } from 'firebase/firestore';

import { byListDateDesc, toMillis } from 'api/app/book/userBookOrder';
import { UserBook } from 'api/app/types';
import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { readGuestData } from 'api/guest/guestStore';
import { BookResult } from 'api/google-books/search';

const PAGE_LENGTH = 30;

interface QueryResult {
  books: (UserBook & Partial<BookResult>)[];
  /** The whole list, sorted. Read once by the first page, reused by the rest. */
  entries: UserBook[];
  /** Where the next page starts in `entries`, or null once all are loaded. */
  nextOffset: number | null;
}

type PageParam = { entries: UserBook[]; offset: number } | null;

export const useUserBooksQuery = ({
  withRefs,
}: { withRefs?: boolean } = {}) => {
  const { isGuest } = useGuest();

  return useInfiniteQuery<QueryResult>({
    queryKey: ['userBooks', withRefs, isGuest],
    queryFn: async ({ pageParam }) => {
      if (isGuest) {
        // A guest is capped at three books, so there is nothing to paginate
        // and the book payload is already stored alongside the entry — no
        // `bookRef` hydration needed.
        const { books } = await readGuestData();
        const guestBooks = Object.entries(books).map(
          ([id, { book, isRead, addedAt, readAt }]) => ({
            id,
            isRead,
            addedAt,
            readAt,
            ...book,
          }),
        ) as QueryResult['books'];

        return {
          books: guestBooks.sort(byListDateDesc),
          entries: [],
          nextOffset: null,
        };
      }

      const userId = auth.currentUser?.uid;
      if (!userId) return { books: [], entries: [], nextOffset: null };

      // Ordering can't be left to Firestore: orderBy leaves out documents
      // missing the field, which would hide every book put on a list before
      // these dates were tracked. So read the list itself — small documents,
      // just a reference and a few fields — once, sort it here, and only
      // fetch the book details, the expensive part, a page at a time.
      const param = pageParam as PageParam;
      const entries =
        param?.entries ??
        (await getDocs(collection(db, 'users', userId, 'books'))).docs
          .map(snapshot => {
            const data = snapshot.data();
            return {
              id: snapshot.id,
              ...data,
              addedAt: toMillis(data.addedAt),
              readAt: toMillis(data.readAt),
            } as UserBook;
          })
          .sort(byListDateDesc);
      const offset = param?.offset ?? 0;

      const books = await Promise.all(
        entries.slice(offset, offset + PAGE_LENGTH).map(async entry => {
          if (withRefs && entry.bookRef) {
            const refData = (await getDoc(entry.bookRef)).data() as BookResult;
            return { ...entry, ...refData };
          }
          return entry;
        }),
      );

      const nextOffset =
        offset + PAGE_LENGTH < entries.length ? offset + PAGE_LENGTH : null;

      return { books, entries, nextOffset };
    },
    initialPageParam: null,
    getNextPageParam: lastPage =>
      lastPage.nextOffset === null
        ? null
        : { entries: lastPage.entries, offset: lastPage.nextOffset },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
