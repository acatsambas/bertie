import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useShopsQuery } from 'api/app/shops';
import { Shop } from 'api/app/types';
import EmptyState from 'components/EmptyState';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import BookShop from '../Bookshop';
import LoadingState from '../LoadingState/LoadingState';

export interface DiscoverPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.DISCOVER_01_DISCOVER
> {}

const BookshopsList = () => {
  const { data: shops = [], isLoading, isError } = useShopsQuery();
  const { navigate } = useNavigation<DiscoverPageProps>();
  const { t } = useTranslation();

  const handlePressShop = (shop: Shop) => {
    navigate(Routes.DISCOVER_03_BOOKSHOP, { shop });
  };

  // A failed load used to leave the spinner up for good: the old local flag
  // only ever cleared once shops arrived.
  if (isLoading) return <LoadingState />;

  if (isError || shops.length === 0) {
    return (
      <EmptyState
        variant="list"
        icon="bookshop"
        title={t(
          isError
            ? translations.discover.bookshopsErrorTitle
            : translations.discover.noBookshopsYetTitle,
        )}
        description={t(
          isError
            ? translations.discover.bookshopsErrorDescription
            : translations.discover.noBookshopsYetDescription,
        )}
      />
    );
  }

  return (
    <View>
      {shops.map(shop => (
        <BookShop
          key={shop.id}
          name={shop.name}
          location={shop.city}
          kind="default"
          onPress={() => handlePressShop(shop)}
        />
      ))}
    </View>
  );
};

export default BookshopsList;
