import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppleSigninButton from '../../components/AuthButtons/Apple';
import GoogleButton from '../../components/AuthButtons/GoogleButton';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';

const NoAccountScreen = ({ navigation }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {};

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text kind="bigHeader" text={t(translations.noAccount.title)} />
          <Icon icon="left" onPress={handleBack} />
        </View>
        <Text kind="paragraph" text={t(translations.noAccount.paragraph)} />
        <View style={styles.buttons}>
          <Button
            kind="primary"
            text={t(translations.welcome.email)}
            onPress={handleLogin}
          />
          <GoogleButton />
          {Platform.OS === 'ios' && <AppleSigninButton />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  container: { paddingTop: 20, gap: 20 },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  buttons: {
    gap: 20,
  },
}));

export default NoAccountScreen;
