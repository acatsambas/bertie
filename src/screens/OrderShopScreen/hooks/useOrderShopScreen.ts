import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { usePlaceOrderMutation } from 'api/app/orders';
import { useFavouriteShopsQuery, useShopsQuery } from 'api/app/shops';
import { Shop } from 'api/app/types';
import { useUserQuery } from 'api/app/user';
import { useDraftOrder } from 'contexts/DraftOrderContext';
import { useToast } from 'contexts/ToastContext';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';

import { OrderShopScreenProps } from '../OrderShopScreen';
import { needsRealContactEmail } from './utils';

export const useOrderShopScreen = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { navigate } = useNavigation<OrderShopScreenProps>();
  const { bookIds } = useDraftOrder();
  const { mutateAsync: placeOrderMutation, isPending: isPlacing } =
    usePlaceOrderMutation();

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
    if (!user || bookIds.length === 0 || isPlacing || !favouriteShop) return;

    if (needsRealContactEmail(user.contactEmail)) {
      navigate(Routes.ORDER_05_EMAIL_SCREEN);
      return;
    }

    try {
      await placeOrderMutation({
        user,
        shop: favouriteShop,
        bookIds,
      });
      navigate(Routes.ORDER_06_ORDER_PLACED, {
        bookshopName: favouriteShop.name,
      });
    } catch {
      showToast(t(translations.order.placeError));
    }
  };

  return {
    bookshops: {
      favourites: favouriteShops
        .map(({ id }) => shops.find(shop => shop.id === id))
        .filter((shop): shop is Shop => shop != null),
      rest: moreBookshops,
    },
    isPlaceDisabled: !favouriteShop || !user?.address || isPlacing,
    placeOrder,
  };
};
