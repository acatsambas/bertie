import firestore from '@react-native-firebase/firestore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import OrderBookshopList from 'components/OrderBookshopList';
import Text from 'components/Text';

import { useFavouriteShops, useShops, useUser } from 'api/app/hooks';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export interface OrderShopScreenProps
  extends StackNavigationProp<
    NavigationType,
    typeof Routes.ORDER_02_ORDER_SHOP
  > {}

const OrderShopScreen = () => {
  const user = useUser();
  const shops = useShops();
  const favouriteShops = useFavouriteShops();
  const favouriteShop = useMemo(
    () => favouriteShops.find(({ id }) => id === user.favouriteShop),
    [favouriteShops, user?.favouriteShop],
  );
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderShopScreenProps>();
  const route =
    useRoute<RouteProp<NavigationType, typeof Routes.ORDER_02_ORDER_SHOP>>();
  const handlePlace = async () => {
    if (
      !user?.contactEmail ||
      user?.contactEmail.includes('@privaterelay.appleid.com')
    ) {
      navigate(Routes.ORDER_05_EMAIL_SCREEN);
    } else {
      await firestore()
        .collection('orders')
        .add({
          userRef: firestore().doc(`users/${user.documentId}`),
          shopRef: firestore().doc(`shops/${favouriteShop.id}`),
          booksRef: route.params.books.map(({ id }) =>
            firestore().doc(`books/${id}`),
          ),
          status: 'ordered',
        });

      const favouriteShopData = shops.find(
        shop => shop.id === favouriteShop.id,
      );

      if (!favouriteShopData) {
        return;
      }
      // TODO: move this to a firebase function
      await firestore()
        .collection('mail')
        .add({
          from: {
            name: 'Bertie',
            address: 'acatsambas@bertieapp.com',
          },
          to: [favouriteShopData.email],
          cc: [user.contactEmail],
          message: {
            subject: 'New Book Order',
            text: `Dear ${favouriteShopData.name} team,

${user.givenName} ${user.familyName} would like to order these books:
${route.params.books.map(book => `- ${book?.volumeInfo?.title} (${book?.volumeInfo?.authors?.join?.(', ')})`).join('\n')}

Their address is:
${user.address?.firstLine && user.address.firstLine}
${user.address?.secondLine && user.address.secondLine}
${user.address?.city && `${user.address.city}, `}${user.address?.postcode}
${user.address?.country ? user.address.country : 'United Kingdom'}

Please get in touch with them directly to arrange payment and delivery at ${user.contactEmail}.

Thank you,
Bertie`,
          },
        });

      navigate(Routes.ORDER_06_ORDER_PLACED, {
        bookshopName: favouriteShopData.name,
      });
    }
  };

  const handleBack = () => {
    navigate(Routes.ORDER_01_ORDER);
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
          shops={favouriteShops
            .map(({ id }) => shops.find(shop => shop.id === id))
            .filter(Boolean)}
        />
        <OrderBookshopList shops={shops} kind="more" />
      </ScrollView>

      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.order.place)}
          onPress={handlePlace}
          disabled={!favouriteShop || !user?.address}
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
