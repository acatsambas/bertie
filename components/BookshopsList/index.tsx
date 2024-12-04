import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { useEffect, useState } from 'react';

import { useShops } from '../../api/app/hooks';
import { Shop } from '../../api/app/types';
import { DiscoverNavigatorParamList } from '../../navigation/AppStack/params';
import BookShop from '../Bookshop';
import LoadingState from '../LoadingState/LoadingState';

export interface DiscoverPageProps
  extends StackNavigationProp<DiscoverNavigatorParamList, 'Discover'> {}

const BookshopsList = () => {
  const shops = useShops();
  const { navigate } = useNavigation<DiscoverPageProps>();
  const [isLoading, setIsLoading] = useState(true);

  const handlePressShop = (shop: Shop) => {
    navigate('Bookshop', { shop });
  };

  useEffect(() => {
    if (shops.length > 0) {
      setIsLoading(false);
    }
  }, [shops]);

  return (
    <View>
      {isLoading ? (
        <LoadingState />
      ) : (
        shops.map(shop => (
          <BookShop
            key={shop.id}
            name={shop.name}
            location={shop.city}
            kind="default"
            onPress={() => handlePressShop(shop)}
          />
        ))
      )}
    </View>
  );
};

export default BookshopsList;
