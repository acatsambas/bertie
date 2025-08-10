import firestore from '@react-native-firebase/firestore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMemo } from 'react';

import { useFavouriteShopsQuery, useShopsQuery } from 'api/app/shops';
import { useUserQuery } from 'api/app/user';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { OrderShopScreenProps } from 'screens/OrderShopScreen/index';

const getOrderMail = ({ selectedShop, user, books }) => ({
  from: {
    name: 'Bertie',
    address: 'acatsambas@bertieapp.com',
  },
  to: [selectedShop.email],
  cc: [user.contactEmail],
  message: {
    subject: 'New Book Order',
    text: `Dear ${selectedShop.name} team,

${user.givenName} ${user.familyName} would like to order these books:
${books.map(book => `- ${book?.volumeInfo?.title} (${book?.volumeInfo?.authors?.join?.(', ')})`).join('\n')}

Their address is:
${user.address?.firstLine && user.address.firstLine}
${user.address?.secondLine && user.address.secondLine}
${user.address?.city && `${user.address.city}, `}${user.address?.postcode}
${user.address?.country ? user.address.country : 'United Kingdom'}

Please get in touch with them directly to arrange payment and delivery at ${user.contactEmail}.

Thank you,
Bertie`,
  },
});

const isInvalidEmail = (email?: string) =>
  !email || email.includes('@privaterelay.appleid.com');

export const useOrderShopScreen = () => {
  const { navigate } = useNavigation<OrderShopScreenProps>();
  const route =
    useRoute<RouteProp<NavigationType, typeof Routes.ORDER_02_ORDER_SHOP>>();

  const books = route.params.books;
  const { data: user = {} } = useUserQuery();
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
