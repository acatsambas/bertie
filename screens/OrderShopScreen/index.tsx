import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { makeStyles } from '@rneui/themed';

import { translations } from '../../locales/translations';
import { OrderNavigatorParamList } from '../../navigation/AppStack/params';
import Text from '../../components/Text';
import Button from '../../components/Button';
import OrderBookshopList from '../../components/OrderBookshopList';

export interface OrderPageProps
  extends StackNavigationProp<OrderNavigatorParamList, 'OrderShop'> {}

const OrderShopScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();

  const handlePlace = () => {
    navigate('OrderPlaced');
  };

  const handleBack = () => {
    navigate('Order');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text text={t(translations.order.title)} kind="bigHeader" />
        <Text text={t(translations.order.where)} kind="paragraph" />
        <OrderBookshopList kind="favourites" />
        <OrderBookshopList kind="more" />
      </ScrollView>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.order.place)}
          onPress={handlePlace}
        />
        <Button
          kind="tertiary"
          text={t(translations.order.back)}
          onPress={handleBack}
        />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FDF9F6',
    position: 'relative',
  },
  container: { paddingTop: 20, gap: 20, paddingBottom: 150 },
  bottomArea: {
    backgroundColor: '#FDF9F6',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
    gap: 20,
    position: 'absolute',
    bottom: 0,
    right: 20,
    left: 20,
  },
}));

export default OrderShopScreen;
