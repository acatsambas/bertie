import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import Text from 'components/Text';

import { OrderNavigatorParamList } from 'navigation/AppStack/params';

import { translations } from 'locales/translations';

const OrderPlacedScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { params } =
    useRoute<RouteProp<OrderNavigatorParamList, 'OrderPlaced'>>();
  const { bookshopName } = params;
  const navigation = useNavigation<any>();

  const handlePressDone = () => {
    navigation.replace('LibraryNavigator', {
      screen: 'Library',
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text text={t(translations.order.allDone)} kind="bigHeader" />
        <Text
          text={t(translations.order.sent, {
            bookshopName: bookshopName || t(translations.order.bookshop),
          })}
          kind="paragraph"
        />
        <Text text={t(translations.order.relax)} kind="paragraph" />
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.order.done)}
          onPress={handlePressDone}
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
  bottomArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
}));

export default OrderPlacedScreen;
