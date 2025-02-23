import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Tab, makeStyles } from '@rneui/themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Avatar from 'components/Avatar';
import BottomMenu from 'components/BottomMenu';
import Text from 'components/Text';

import { useUser } from 'api/app/hooks';

import { AppNavigatorParamList } from 'navigation/AppStack/params';

import { translations } from 'locales/translations';

import { BooksTab, BookshopTab } from './components';

export interface DiscoverScreenProps
  extends StackNavigationProp<AppNavigatorParamList, 'DiscoverNavigator'> {}

const DiscoverScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<DiscoverScreenProps>();
  const user = useUser();

  const [index, setIndex] = useState(0);

  const handleAvatarClick = () => {
    navigate('SettingsNavigator');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text text={t(translations.discover.title)} kind="bigHeader" />
          <Avatar onPress={handleAvatarClick} />
        </View>
        <Tab
          value={index}
          onChange={setIndex}
          titleStyle={{
            fontFamily: 'GoudyBookletter1911_400Regular',
            fontSize: 24,
          }}
        >
          <Tab.Item>{t(translations.discover.bookshops)}</Tab.Item>
          <Tab.Item>{t(translations.discover.books)}</Tab.Item>
        </Tab>
        {index === 0 ? <BookshopTab user={user} /> : <BooksTab />}
      </View>
      <BottomMenu />
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

export default DiscoverScreen;
