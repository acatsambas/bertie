import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { useMemo } from 'react';

import { useFavouriteShopsQuery, useShopsQuery } from 'api/app/shops';
import { useUserQuery } from 'api/app/user';
import { db } from 'api/firebase';
import { fetchBook } from 'api/google-books/fetchBook';
import { useDraftOrder } from 'contexts/DraftOrderContext';
import { Routes } from 'navigation/routes';

import { OrderShopScreenProps } from '../OrderShopScreen';
import { getOrderMail, needsRealContactEmail } from './utils';

export const useOrderShopScreen = () => {
  const { navigate } = useNavigation<OrderShopScreenProps>();
  const queryClient = useQueryClient();
  const { bookIds } = useDraftOrder();

  const { data: user } = useUserQuery();
  const { data: shops = [] } = useShopsQuery();
  const { data: favouriteShops = [] } = useFavouriteShopsQuery();

  const mappedFavouriteShopIds = useMemo(
    () => new Set(favouriteShops.map(({ id }) => id)),
    [favouriteShops],
  );

  const moreBookshops = useMemo(
    () => shops.filter(({ id }) => !mappedFavouriteShopIds.has(id)),
    [shops, mappedFavouriteShopIds],
  );

  const favouriteShop = useMemo(
    () => shops.find(({ id }) => id === user?.favouriteShop),
    [shops, user?.favouriteShop],
  );

  const placeOrder = async () => {
    if (!user || bookIds.length === 0) return;

    if (needsRealContactEmail(user?.contactEmail)) {
      navigate(Routes.ORDER_05_EMAIL_SCREEN);
      return;
    }

    if (!favouriteShop) return;

    await addDoc(collection(db, 'orders'), {
      userRef: doc(db, 'users', user.documentId),
      shopRef: doc(db, 'shops', favouriteShop.id),
      booksRef: bookIds.map(id => doc(db, 'books', id)),
      status: 'ordered',
      createdAt: serverTimestamp(),
    });

    // The Past orders tab is mounted behind this flow, so it needs telling.
    void queryClient.invalidateQueries({ queryKey: ['orderHistory'] });

    const selectedShop = shops.find(shop => shop.id === favouriteShop.id);

    if (!selectedShop) {
      return;
    }

    const books = await Promise.all(bookIds.map(id => fetchBook(id)));

    await addDoc(
      collection(db, 'mail'),
      getOrderMail({ user, selectedShop, books }),
    );

    navigate(Routes.ORDER_06_ORDER_PLACED, {
      bookshopName: selectedShop.name,
    });
  };

  return {
    bookshops: {
      favourites: favouriteShops
        .map(({ id }) => shops.find(shop => shop.id === id))
        .filter(Boolean),
      rest: moreBookshops,
    },
    canPlaceOrder: !favouriteShop || !user?.address,
    placeOrder,
  };
};
