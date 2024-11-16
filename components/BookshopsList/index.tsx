import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';

import { useShops } from '../../api/app/hooks';
import { Shop } from '../../api/app/types';
import { DiscoverNavigatorParamList } from '../../navigation/AppStack/params';
import BookShop from '../Bookshop';

export interface DiscoverPageProps
  extends StackNavigationProp<DiscoverNavigatorParamList, 'Discover'> {}

const BookshopsList = () => {
  const shops = useShops();
  const { navigate } = useNavigation<DiscoverPageProps>();

  const handlePressShop = (shop: Shop) => {
    navigate('Bookshop', { shop });
  };

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
