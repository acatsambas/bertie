import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import OrderBookshopList from 'components/OrderBookshopList';
import Text from 'components/Text';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

import { useOrderShopScreen } from './hooks/useOrderShopScreen';

export interface OrderShopScreenProps
  extends StackNavigationProp<
    NavigationType,
    typeof Routes.ORDER_02_ORDER_SHOP
  > {}

export const OrderShopScreen = () => {
  const { t } = useTranslation();
  const { bookshops, placeOrder, canPlaceOrder } = useOrderShopScreen();
  const styles = useStyles();
  const { navigate } = useNavigation<OrderShopScreenProps>();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text text={t(translations.order.title)} kind="bigHeader" />
        <Text text={t(translations.order.where)} kind="paragraph" />
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
        <Button
          kind="tertiary"
          text={t(translations.order.back)}
          onPress={() => navigate(Routes.ORDER_01_ORDER)}
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
  container: { paddingTop: 20, gap: 20, paddingBottom: 150 },
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
