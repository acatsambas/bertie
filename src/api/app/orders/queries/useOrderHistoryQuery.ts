import { useQuery } from '@tanstack/react-query';
import {
  DocumentData,
  DocumentReference,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { Order, OrderBook, Shop } from 'api/app/types';
import { auth, db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';

const resolveBooks = async (
  booksRef: DocumentReference<DocumentData>[] = [],
): Promise<OrderBook[]> =>
  Promise.all(
    booksRef.map(async ref => {
      const snapshot = await getDoc(ref);
      const book = snapshot.data() as BookResult | undefined;

      return {
        id: ref.id,
        title: book?.volumeInfo?.title,
        authors: book?.volumeInfo?.authors,
      };
    }),
  );

export const useOrderHistoryQuery = () => {
  const userId = auth.currentUser?.uid;

  return useQuery<Order[]>({
    queryKey: ['orderHistory', userId],
    queryFn: async () => {
      if (!userId) return [];

      // Deliberately no orderBy: pairing a where() with orderBy() on a
      // different field needs a composite index, which this project avoids
      // (see 0afab7f). A reader places a handful of orders, so sorting the
      // result client-side costs nothing.
      const snapshot = await getDocs(
        query(
          collection(db, 'orders'),
          where('userRef', '==', doc(db, 'users', userId)),
        ),
      );

      const orders = await Promise.all(
        snapshot.docs.map(async orderDoc => {
          const data = orderDoc.data();
          const shop = data.shopRef
            ? ((await getDoc(data.shopRef)).data() as Shop | undefined)
            : undefined;

          return {
            id: orderDoc.id,
            status: data.status ?? 'ordered',
            createdAt: data.createdAt,
            shopName: shop?.name,
            books: await resolveBooks(data.booksRef),
          } as Order;
        }),
      );

      // Newest first. Orders placed before createdAt existed have no date and
      // sort to the bottom rather than jumping to the top as epoch zero.
      return orders.sort(
        (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0),
      );
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
