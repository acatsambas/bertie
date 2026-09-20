import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useFavouriteShopsQuery, useShopsQuery } from 'api/app/shops';
import { Shop } from 'api/app/types';
import { useUpdateFavouriteShopMutation, useUserQuery } from 'api/app/user';
import AddressNeededNotice from 'components/AddressNeededNotice';
import EmptyState from 'components/EmptyState';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import BookShop from '../Bookshop';
import LoadingState from '../LoadingState/LoadingState';
import Text from '../Text';

interface OrderBookshopListProps {
  kind: 'favourites' | 'more';
  shops?: Shop[];
}

export interface OrderPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.ORDER_01_ORDER
> {}

const OrderBookshopList = ({ kind, shops = [] }: OrderBookshopListProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();
  const { data: user, isLoading: isLoadingUser } = useUserQuery();
  const { data: allShops = [], isLoading: isLoadingShops } = useShopsQuery();
  const { isLoading: isLoadingFavourites } = useFavouriteShopsQuery();
  const updateFavouriteShop = useUpdateFavouriteShopMutation();

  const isFavourites = kind === 'favourites';
  const title = t(
    isFavourites ? translations.order.favourites : translations.order.more,
  );

  const showLoading = isFavourites
    ? isLoadingFavourites || isLoadingUser
    : isLoadingShops || isLoadingUser;

  const onSelectBookshop = async (shop: Shop) => {
    if (!user) return;
    await updateFavouriteShop.mutateAsync({ shopId: shop.id });
  };

  const renderEmpty = () => {
    if (isFavourites) {
      return (
        <EmptyState
          variant="list"
          icon="bookshop"
          title={t(translations.order.favouritesEmptyTitle)}
          description={t(translations.order.favouritesEmptyDescription)}
        />
      );
    }

    const catalogueEmpty = allShops.length === 0;

    if (!user?.address && catalogueEmpty) {
      return (
        <EmptyState
          variant="list"
          icon="address"
          title={t(translations.order.addAddressTitle)}
          description={t(translations.order.addAddressDescription)}
          action={{
            label: t(translations.order.addAddressAction),
            onPress: () => navigate(Routes.ORDER_03_ADDRESS_SCREEN),
            kind: 'secondary',
          }}
        />
      );
    }

    return (
      <EmptyState
        variant="list"
        icon="bookshop"
        title={t(
          catalogueEmpty
            ? translations.order.moreEmptyNoShopsTitle
            : translations.order.moreEmptyTitle,
        )}
        description={t(
          catalogueEmpty
            ? translations.order.moreEmptyNoShopsDescription
            : translations.order.moreEmptyDescription,
        )}
        action={
          !user?.address
            ? {
                label: t(translations.order.addAddressAction),
                onPress: () => navigate(Routes.ORDER_03_ADDRESS_SCREEN),
                kind: 'secondary',
              }
            : undefined
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text kind="header" text={title} />
      {showLoading ? (
        <LoadingState />
      ) : shops.length === 0 ? (
        renderEmpty()
      ) : (
        <View style={styles.list}>
          {!isFavourites && !user?.address ? (
            <AddressNeededNotice
              title={t(translations.order.addAddressTitle)}
              description={t(translations.order.addAddressDescription)}
              actionLabel={t(translations.order.addAddressAction)}
              onPress={() => navigate(Routes.ORDER_03_ADDRESS_SCREEN)}
            />
          ) : null}
          {shops.map(shop => (
            <BookShop
              key={shop.id}
              name={shop.name}
              location={shop.city}
              onPress={() => onSelectBookshop(shop)}
              kind={
                user?.favouriteShop === shop.id
                  ? 'favoriteSelected'
                  : 'favorite'
              }
            />
          ))}
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: { gap: 14 },
  list: { gap: 10 },
}));

export default OrderBookshopList;
