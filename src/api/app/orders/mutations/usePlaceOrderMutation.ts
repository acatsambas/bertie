import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import { fetchStoredBooks } from 'api/app/book/fetchStoredBooks';
import { getOrderMail } from 'api/app/orders/getOrderMail';
import { Shop } from 'api/app/types';
import { db } from 'api/firebase';
import { UserData } from 'api/types';

type PlaceOrderParams = {
  user: UserData;
  shop: Shop;
  bookIds: string[];
};

export const usePlaceOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, shop, bookIds }: PlaceOrderParams) => {
      if (bookIds.length === 0) {
        throw new Error('No books selected');
      }

      const books = await fetchStoredBooks(bookIds, { requireAll: true });

      const batch = writeBatch(db);
      const orderRef = doc(collection(db, 'orders'));
      batch.set(orderRef, {
        userRef: doc(db, 'users', user.documentId),
        shopRef: doc(db, 'shops', shop.id),
        booksRef: bookIds.map(id => doc(db, 'books', id)),
        status: 'ordered',
        createdAt: serverTimestamp(),
      });
      batch.set(
        doc(collection(db, 'mail')),
        getOrderMail({ user, selectedShop: shop, books }),
      );
      await batch.commit();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
    },
  });
};
