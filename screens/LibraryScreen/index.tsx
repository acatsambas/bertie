import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Avatar from 'components/Avatar';
import BottomMenu from 'components/BottomMenu';
import CurrentBooks from 'components/CurrentBooks';
import PastBooks from 'components/PastBooks';
import Text from 'components/Text';

import { AppNavigatorParamList } from 'navigation/AppStack/params';

import { translations } from 'locales/translations';

export interface LibraryScreenProps
  extends StackNavigationProp<AppNavigatorParamList, 'LibraryNavigator'> {}

const LibraryScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<LibraryScreenProps>();

  const handleAvatarClick = () => {
    navigate('SettingsNavigator');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text text={t(translations.library.title)} kind="bigHeader" />
          <Avatar onPress={handleAvatarClick} />
        </View>
        <CurrentBooks />
        <PastBooks />
      </ScrollView>
      <View style={styles.bottomArea}>
        <BottomMenu />
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
  container: { paddingTop: 20, gap: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
}));

export default LibraryScreen;
