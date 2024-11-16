import firestore from '@react-native-firebase/firestore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFavouriteShops } from '../../api/app/hooks';
import { AuthContext } from '../../api/auth/AuthProvider';
import Button from '../../components/Button';
import GoogleMaps from '../../components/GoogleMaps';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';
import { DiscoverNavigatorParamList } from '../../navigation/AppStack/params';

export interface BookshopPageProps
  extends StackNavigationProp<DiscoverNavigatorParamList, 'Bookshop'> {}

const BookshopScreen = ({ navigation }) => {
  const {
    params: {
      shop: { id, address, city, name, zipcode, description },
    },
  } = useRoute<RouteProp<DiscoverNavigatorParamList, 'Bookshop'>>();
  const { user } = useContext(AuthContext);
  const favouriteShops = useFavouriteShops();
  const isFavourite = useMemo(
    () => favouriteShops.find(shop => shop.id === id),
    [favouriteShops, id],
  );

  const styles = useStyles();
  const { t } = useTranslation();

  const handlePressFavourite = async () => {
    if (isFavourite) {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('favouriteShops')
        .doc(id)
        .delete();

      return;
    }

    const docCreate = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('favouriteShops')
      .doc(id);

    await docCreate.set({
      shopRef: firestore().collection('shops').doc(id),
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <GoogleMaps />
        <View>
          <Text kind="bigHeader" text={name} />
          <Text kind="paragraph" text={`${address}, ${city} ${zipcode}`} />
        </View>
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
        <Button
          kind="tertiary"
          text={t(translations.discover.back)}
          onPress={handleBack}
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

export default BookshopScreen;
