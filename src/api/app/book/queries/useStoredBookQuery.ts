import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

import { db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';

/**
 * Bertie's own copy of a book, saved the first time anyone added or rated it.
 *
 * It carries the title, authors and description, so a book page can fill
 * itself in while Google Books answers — or instead of it, when Google is
 * slow or down. Null for a book nobody has touched yet, and unavailable to
 * visitors who aren't signed in, who can't read Firestore.
 */
export const useStoredBookQuery = (bookId: string) =>
  useQuery<BookResult | null>({
    queryKey: ['storedBook', bookId],
    queryFn: async () => {
      const snapshot = await getDoc(doc(db, 'books', bookId));
      if (!snapshot.exists()) return null;

      return { ...snapshot.data(), id: snapshot.id } as BookResult;
    },
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
