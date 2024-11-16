import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppleSigninButton from '../../components/AuthButtons/Apple';
import GoogleButton from '../../components/AuthButtons/GoogleButton';
import Button from '../../components/Button';
import Illustration from '../../components/Illustration';
import Logo from '../../components/Logo';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';
import { AuthNavigatorParamList } from '../../navigation/AuthStack/params';

export interface WelcomePageProps
  extends StackNavigationProp<AuthNavigatorParamList, 'Welcome'> {}

const WelcomeScreen = () => {
  const styles = useStyles();
  const { navigate } = useNavigation<WelcomePageProps>();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigate('Login');
  };

  const handlePrivacy = async () => {
    await Linking.openURL('https://www.bertieapp.com/privacypolicy.html');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <View style={styles.container}>
        <Text kind="header" text={t(translations.welcome.title)} />

        <View style={styles.welcomeMessage}>
          <Text kind="paragraph" text={t(translations.welcome.purpose)} />

          <View>
            <Text kind="paragraph" text={t(translations.welcome.agree)} />
            <Text
              kind="button"
              text={t(translations.welcome.terms)}
              onPress={handlePrivacy}
            />
          </View>
        </View>

        <Illustration name="welcome" />

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
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.white,
  },
  logo: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    gap: 20,
    width: '100%',
  },
  welcomeMessage: {
    flex: 1,
    gap: 20,
    alignItems: 'flex-start',
  },
  buttons: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
}));

export default WelcomeScreen;
