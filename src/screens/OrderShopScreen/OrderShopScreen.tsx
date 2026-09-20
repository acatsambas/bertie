import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles, useTheme } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackTitleHeader } from 'components/BackTitleHeader';
import Button from 'components/Button';
import OrderBookshopList from 'components/OrderBookshopList';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { useOrderShopScreen } from './hooks/useOrderShopScreen';

export interface OrderShopScreenProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.ORDER_02_ORDER_SHOP
> {}

export const OrderShopScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { bookshops, placeOrder, canPlaceOrder } = useOrderShopScreen();
  const styles = useStyles();
  const navigation = useNavigation<OrderShopScreenProps>();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <BackTitleHeader
          title={t(translations.order.title)}
          onBack={() =>
            goBackOrFallback(navigation, Routes.ORDER_02_ORDER_SHOP)
          }
        />
        <View style={styles.intro}>
          <Text text={t(translations.order.where)} kind="paragraph" />
          <Text
            text={t(translations.order.whereHint)}
            kind="description"
            color={theme.colors.grey2}
          />
        </View>
        <OrderBookshopList kind="favourites" shops={bookshops.favourites} />
        <OrderBookshopList shops={bookshops.rest} kind="more" />
      </ScrollView>

      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.order.place)}
          onPress={placeOrder}
          disabled={canPlaceOrder}
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
    position: 'relative',
  },
  container: { paddingTop: 20, gap: 24, paddingBottom: 150 },
  intro: { gap: 6 },
  bottomArea: {
    backgroundColor: theme.colors.white,
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 20,
    gap: 20,
    position: 'absolute',
    bottom: 0,
    right: 20,
    left: 20,
  },
}));
