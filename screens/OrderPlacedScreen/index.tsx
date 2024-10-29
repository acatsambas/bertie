import React from 'react';
import { View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@rneui/themed';

import { OrderNavigatorParamList } from '../../navigation/AppStack/params';
import { translations } from '../../locales/translations';
import Text from '../../components/Text';
import Button from '../../components/Button';

const OrderPlacedScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { params } =
    useRoute<RouteProp<OrderNavigatorParamList, 'OrderPlaced'>>();
  const { bookshopName } = params;
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text text={t(translations.order.allDone)} kind="bigHeader" />
        <Text
          text={
            t(translations.order.sent) +
            ` ${bookshopName} ` +
            t(translations.order.sent2)
          }
          kind="paragraph"
        />
        <Text text={t(translations.order.relax)} kind="paragraph" />
      </View>
      <View style={styles.bottomArea}>
        <Button kind="primary" text={t(translations.order.done)} />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FDF9F6',
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
