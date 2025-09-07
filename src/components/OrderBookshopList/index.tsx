import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Shop } from 'api/app/types';
import { useUpdateFavouriteShopMutation, useUserQuery } from 'api/app/user';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

import BookShop from '../Bookshop';
import LoadingState from '../LoadingState/LoadingState';
import Text from '../Text';

interface OrderBookshopListProps {
  kind: 'favourites' | 'more';
  shops?: Shop[];
}
export interface OrderPageProps
  extends StackNavigationProp<NavigationType, typeof Routes.ORDER_01_ORDER> {}

const OrderBookshopList = ({ kind, shops }: OrderBookshopListProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();
  const { data: user, isLoading: isLoadingUser } = useUserQuery();
  const [isLoading, setIsLoading] = useState(true);
  const updateFavouriteShop = useUpdateFavouriteShopMutation();

  useEffect(() => {
    if (shops.length > 0 && !isLoadingUser) {
      setIsLoading(false);
    }
  }, [shops, isLoadingUser]);

  const onSelectBookshop = async (shop: Shop) => {
    if (!user) {
      return;
    }

    await updateFavouriteShop.mutateAsync({ shopId: shop.id });
  };

  if (kind === 'favourites') {
    return (
      <View style={styles.container}>
        <Text kind="header" text={t(translations.order.favourites)} />
        {shops.map(shop => (
          <BookShop
            name={shop.name}
            location={shop.city}
            key={shop.id}
            onPress={() => onSelectBookshop(shop)}
            kind={
              user.favouriteShop === shop.id ? 'favoriteSelected' : 'favorite'
            }
          />
        ))}
      </View>
    );
  }

  if (kind === 'more') {
    return (
      <View style={styles.container}>
        <Text kind="header" text={t(translations.order.more)} />
        {user?.address && (
          <View style={styles.addressCTA}>
            <Text
              kind="paragraph"
              text={t(translations.order.add)}
              onPress={() => navigate(Routes.ORDER_03_ADDRESS_SCREEN)}
            />
          </View>
        )}
        {isLoading ? (
          <LoadingState />
        ) : (
          shops.map(shop => (
            <BookShop
              name={shop.name}
              location={shop.city}
              key={shop.id}
              kind={
                user.favouriteShop === shop.id ? 'favoriteSelected' : 'favorite'
              }
              onPress={() => onSelectBookshop(shop)}
            />
          ))
        )}
      </View>
    );
  }
};

const useStyles = makeStyles(() => ({
  container: { gap: 16 },
  header: { marginBottom: 16 },
  addressCTA: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#8839f5',
    backgroundColor: '#F3EAFF',
    padding: 16,
  },
}));

export default OrderBookshopList;
