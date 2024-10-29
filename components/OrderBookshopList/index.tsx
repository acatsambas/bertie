import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';

import { makeStyles } from '@rneui/themed';

import { StackNavigationProp } from '@react-navigation/stack';
import {
  OrderNavigatorParamList,
  BookshopType,
} from '../../navigation/AppStack/params';
import {
  fetchBookshops,
  pickFavoriteShop,
  getPickedFavoriteShop,
} from '../../api/app/hooks';
import { translations } from '../../locales/translations';
import { AuthContext } from '../../api/auth/AuthProvider';
import Text from '../../components/Text';
import BookShop from '../Bookshop';

interface OrderBookshopListProps {
  kind: 'favourites' | 'more';
  shops?: BookshopType[];
}
export interface OrderPageProps
  extends StackNavigationProp<OrderNavigatorParamList, 'OrderShop'> {}

const OrderBookshopList = ({ kind, shops }: OrderBookshopListProps) => {
  const [allShops, setAllShops] = useState([]);
  const [hasAddress, setHasAddress] = useState(true);
  const [isPicked, setIsPicked] = useState('');

  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();

  const { user } = useContext(AuthContext);
  const userId = user.uid;

  useEffect(() => {
    handleAllBookShops();
    handleUserAddress();
    handlePickedBookShop();
  }, []);

  const handleAllBookShops = async () => {
    const bookShops = await fetchBookshops();
    setAllShops(bookShops);
  };

  const handlePickedBookShop = async () => {
    const pickedBookShop = await getPickedFavoriteShop();
    setIsPicked(pickedBookShop);
  };

  const handleUserAddress = async () => {
    try {
      const usrSnapshop = await firestore()
        ?.collection('Address')
        ?.doc(userId)
        .get();
      // eslint-disable-next-line no-unused-expressions
      usrSnapshop.exists ? setHasAddress(true) : setHasAddress(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    navigate('AddressScreen');
  };

  const handlePick = async (id: string) => {
    await pickFavoriteShop(id);
    handlePickedBookShop();
  };

  const handleNavigateBookshop = (bookshop: BookshopType) => {
    navigate('Bookshop', bookshop);
  };

  return (
    <View>
      {kind === 'favourites' ? (
        <View>
          <Text kind="header" text={t(translations.order.favourites)} />
          {shops.map(
            shop =>
              shop.isFav && (
                <BookShop
                  name={shop.name}
                  location={shop.city}
                  key={shop.id}
                  onPress={() => handlePick(shop.id)}
                  kind={shop.id === isPicked ? 'favoriteSelected' : 'favorite'}
                />
              ),
          )}
        </View>
      ) : (
        <View style={styles.container}>
          <Text kind="header" text={t(translations.order.more)} />
          {!hasAddress && (
            <View style={styles.purple}>
              <Text
                kind="paragraph"
                text={t(translations.order.add)}
                onPress={handleAdd}
              />
            </View>
          )}
          {allShops.map(shop => (
            <BookShop
              name={shop.name}
              location={shop.city}
              key={shop.id}
              kind="default"
              onPress={() => handleNavigateBookshop(shop)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: { gap: 20 },
  purple: {
    backgroundColor: '#F3EAFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
}));

export default OrderBookshopList;
