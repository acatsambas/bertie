import { Tab, makeStyles } from '@rneui/themed';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Text from 'components/Text';

import { translations } from 'locales/translations';

import { NewOrderTab, PastOrdersTab } from './components';

export const OrderScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView edges={['left', 'right', 'top']} style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text text={t(translations.order.title)} kind="bigHeader" />
        </View>
        <Tab
          value={index}
          onChange={setIndex}
          titleStyle={{
            fontFamily: 'GoudyBookletter1911_400Regular',
            fontSize: 24,
          }}
        >
          <Tab.Item>{t(translations.order.history.tabNew)}</Tab.Item>
          <Tab.Item>{t(translations.order.history.tabPast)}</Tab.Item>
        </Tab>
        {index === 0 ? <NewOrderTab /> : <PastOrdersTab />}
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
}));
