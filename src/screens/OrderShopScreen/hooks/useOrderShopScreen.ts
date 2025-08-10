import firestore from '@react-native-firebase/firestore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMemo } from 'react';

import { useFavouriteShopsQuery, useShopsQuery } from 'api/app/shops';
import { useUserQuery } from 'api/app/user';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { OrderShopScreenProps } from '../OrderShopScreen';
import { getOrderMail, isInvalidEmail } from './utils';

export const useOrderShopScreen = () => {
  const { navigate } = useNavigation<OrderShopScreenProps>();
  const route =
    useRoute<RouteProp<NavigationType, typeof Routes.ORDER_02_ORDER_SHOP>>();

  const books = route.params.books;
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
    if (isInvalidEmail(user?.contactEmail)) {
      navigate(Routes.ORDER_05_EMAIL_SCREEN);
      return;
    }

    await firestore()
      .collection('orders')
      .add({
        userRef: firestore().doc(`users/${user.documentId}`),
        shopRef: firestore().doc(`shops/${favouriteShop.id}`),
        booksRef: books.map(({ id }) => firestore().doc(`books/${id}`)),
        status: 'ordered',
      });

    const selectedShop = shops.find(shop => shop.id === favouriteShop.id);

    if (!selectedShop) {
      return;
    }

    await firestore()
      .collection('mail')
      .add(getOrderMail({ user, selectedShop, books }));

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
