import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';

import { makeStyles } from '@rneui/themed';

import { translations } from '../../locales/translations';
import { AuthContext } from '../../api/auth/AuthProvider';
import Text from '../../components/Text';
import BookShop from '../Bookshop';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  OrderNavigatorParamList,
  BookshopType,
} from '../../navigation/AppStack/params';

interface OrderBookshopListProps {
  kind: 'favourites' | 'more';
}
export interface OrderPageProps
  extends StackNavigationProp<OrderNavigatorParamList, 'OrderShop'> {}

const OrderBookshopList = ({ kind }: OrderBookshopListProps) => {
  const [favoriteShops, setFavoriteShops] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [hasAddress, setHasAddress] = useState(true);
  const [isFavorite, setIsFavorite] = useState([]);

  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();

  const { user } = useContext(AuthContext);
  const userId = user.uid;

  useEffect(() => {
    handleFavouriteShops();
    handleAllBookShops();
    handleUserAddress();
  }, []);

  const handleFavouriteShops = async () => {
    try {
      const shopsSnapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('bookstores')
        .get();
      const bookShopsList = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavoriteShops(bookShopsList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAllBookShops = async () => {
    try {
      const shopsSnapshot = await firestore().collection('shops').get();
      const bookShopsList = shopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllShops(bookShopsList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserAddress = async () => {
    try {
      const usrSnapshop = await firestore()
        .collection('Address')
        .doc(userId)
        .get();
      usrSnapshop.exists ? setHasAddress(true) : setHasAddress(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    navigate('AddressScreen');
  };

  const handlePick = (id: string, name: string) => {
    setIsFavorite([id, name, !isFavorite[2]]);
  };

  const handleNavigateBookshop = (bookshop: BookshopType) => {
    navigate('Bookshop', bookshop);
  };

  return (
    <View>
      {kind === 'favourites' ? (
        <View>
          <Text kind="header" text={t(translations.order.favourites)} />
          {favoriteShops.map(
            shop =>
              shop.isFav && (
                <BookShop
                  name={shop.name}
                  location={shop.city}
                  key={shop.id}
                  onPress={() => handlePick(shop.id, shop.name)}
                  kind={
                    shop.id === isFavorite[0] ? 'favoriteSelected' : 'favorite'
                  }
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
