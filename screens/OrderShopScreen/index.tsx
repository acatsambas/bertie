import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { makeStyles } from '@rneui/themed';

import { translations } from '../../locales/translations';
import { OrderNavigatorParamList } from '../../navigation/AppStack/params';
import { fetchUserBookShops, getBookshopNameById } from '../../api/app/hooks';
import Text from '../../components/Text';
import Button from '../../components/Button';
import OrderBookshopList from '../../components/OrderBookshopList';

export interface OrderPageProps
  extends StackNavigationProp<OrderNavigatorParamList, 'OrderShop'> {}

const OrderShopScreen = () => {
  const [favShops, setFavShops] = useState([]);
  const [isPicked, setIsPicked] = useState('');
  const [shopName, setShopName] = useState('');
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();
  const { params } =
    useRoute<RouteProp<OrderNavigatorParamList, 'OrderShop'>>();

  console.log(params);

  const handlePlace = () => {
    navigate('OrderPlaced', { bookshopName: shopName });
  };

  const handleBack = () => {
    navigate('Order');
  };

  useEffect(() => {
    getUserFavShops();
  }, []);

  useEffect(() => {
    const getShopName = getBookshopNameById(isPicked, favShops);
    setShopName(getShopName);
  }, [isPicked]);

  const getUserFavShops = async () => {
    const usrFavShops = await fetchUserBookShops();
    setFavShops(usrFavShops);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text text={t(translations.order.title)} kind="bigHeader" />
        <Text text={t(translations.order.where)} kind="paragraph" />
        <OrderBookshopList
          kind="favourites"
          shops={favShops}
          isPicked={isPicked}
          setIsPicked={setIsPicked}
        />
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
