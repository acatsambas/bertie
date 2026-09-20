import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useFavouriteShopsQuery,
  useToggleFavouriteShopMutation,
} from 'api/app/shops';
import { BackTitleHeader } from 'components/BackTitleHeader';
import Button from 'components/Button';
import GoogleMaps from 'components/GoogleMaps';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

export interface BookshopPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.DISCOVER_03_BOOKSHOP
> {}

export const BookshopScreen = ({ navigation }) => {
  const route =
    useRoute<RouteProp<NavigationType, typeof Routes.DISCOVER_03_BOOKSHOP>>();
  const {
    params: {
      shop: { id, address, city, name, zipcode, description },
    },
  } = route;
  const { data: favouriteShops = [] } = useFavouriteShopsQuery();
  const { mutate: toggleFavouriteShop } = useToggleFavouriteShopMutation();

  const isFavourite = useMemo(
    () => !!favouriteShops?.find(shop => shop.id === id),
    [favouriteShops, id],
  );

  const styles = useStyles();
  const { t } = useTranslation();

  const handlePressFavourite = () => {
    toggleFavouriteShop({ shopId: id, isFavourite });
  };

  const handleBack = () => {
    goBackOrFallback(navigation, route.name);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View>
          <BackTitleHeader title={name} onBack={handleBack} />
          <Text kind="paragraph" text={`${address}, ${city} ${zipcode}`} />
        </View>
        <GoogleMaps />
        <View>
          <RenderHtml source={{ html: description }} contentWidth={0} />
        </View>
        <Button
          kind="primary"
          text={
            !isFavourite
              ? t(translations.discover.add)
              : t(translations.discover.remove)
          }
          onPress={handlePressFavourite}
        />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  container: { paddingTop: 20, gap: 20 },
}));
