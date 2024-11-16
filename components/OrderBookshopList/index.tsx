import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useUser } from '../../api/app/hooks';
import { Shop } from '../../api/app/types';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';
import { OrderNavigatorParamList } from '../../navigation/AppStack/params';
import BookShop from '../Bookshop';

interface OrderBookshopListProps {
  kind: 'favourites' | 'more';
  shops?: Shop[];
}
export interface OrderPageProps
  extends StackNavigationProp<OrderNavigatorParamList, 'OrderShop'> {}

const OrderBookshopList = ({ kind, shops }: OrderBookshopListProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();
  const user = useUser();

  if (kind === 'favourites') {
    return (
      <View>
        <Text kind="header" text={t(translations.order.favourites)} />
        {shops.map(shop => (
          <BookShop
            name={shop.name}
            location={shop.city}
            key={shop.id}
            onPress={async () => {
              firestore().collection('users').doc(user.documentId).update({
                favouriteShop: shop.id,
              });
            }}
            kind={
              user.favouriteShop === shop.id ? 'favoriteSelected' : 'favorite'
            }
          />
        ))}
      </View>
    );
  }

  if (kind === 'more') {
    return (
      <View style={styles.container}>
        <Text kind="header" text={t(translations.order.more)} />
        {/* {!hasAddress && (
          <View style={styles.purple}>
            <Text
              kind="paragraph"
              text={t(translations.order.add)}
              onPress={handleAdd}
            />
          </View>
        )} */}
        {shops.map(shop => (
          <BookShop
            name={shop.name}
            location={shop.city}
            key={shop.id}
            kind="default"
            onPress={() => navigate('Bookshop', { shop })}
          />
        ))}
      </View>
    );
  }
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
