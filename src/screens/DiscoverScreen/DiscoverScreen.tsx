import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Tab, makeStyles } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserQuery } from 'api/app/user';
import Avatar from 'components/Avatar';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { BooksTab, BookshopTab, InsightsTab } from './components';

export interface DiscoverScreenProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.DISCOVER_01_DISCOVER
> {}

export const DiscoverScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<DiscoverScreenProps>();
  const { data: user } = useUserQuery();
  const isDesktop = useIsDesktop();

  const [index, setIndex] = useState(0);

  const handleAvatarClick = () => navigate(Routes.APP_02_SETTINGS);

  const renderTab = () => {
    switch (index) {
      case 0:
        return <BooksTab />;
      case 1:
        return <BookshopTab user={user} />;
      case 2:
        return <InsightsTab />;
      default:
        return <BooksTab />;
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'top']} style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text text={t(translations.discover.title)} kind="bigHeader" />
          {/* On desktop the side rail carries the link to settings. */}
          {!isDesktop && <Avatar onPress={handleAvatarClick} />}
        </View>
        <Tab
          value={index}
          onChange={setIndex}
          titleStyle={{
            fontFamily: 'GoudyBookletter1911_400Regular',
            fontSize: 24,
          }}
        >
          <Tab.Item>{t(translations.discover.books)}</Tab.Item>
          <Tab.Item>{t(translations.discover.bookshops)}</Tab.Item>
          <Tab.Item>{t(translations.discover.insights.tab)}</Tab.Item>
        </Tab>
        {renderTab()}
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
}));
