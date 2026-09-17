import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useShopsQuery } from 'api/app/shops';
import { Shop } from 'api/app/types';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

import BookShop from '../Bookshop';
import LoadingState from '../LoadingState/LoadingState';
import Text from '../Text';

export interface DiscoverPageProps
  extends StackNavigationProp<
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
      <View style={styles.emptyState}>
        <Text
          kind="description"
          text={t(
            isError
              ? translations.discover.bookshopsError
              : translations.discover.noBookshopsYet,
          )}
        />
      </View>
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

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingTop: 20,
  },
});

export default BookshopsList;
