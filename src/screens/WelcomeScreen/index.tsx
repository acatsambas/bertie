import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppleSigninButton from 'components/AuthButtons/Apple';
import GoogleButton from 'components/AuthButtons/GoogleButton';
import Button from 'components/Button';
import Illustration from 'components/Illustration';
import Logo from 'components/Logo';
import Text from 'components/Text';

import { Routes } from 'navigation/routes';
import type { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export interface WelcomePageProps
  extends StackNavigationProp<NavigationType, typeof Routes.AUTH_01_WELCOME> {}

const WelcomeScreen = () => {
  const styles = useStyles();
  const { navigate } = useNavigation<WelcomePageProps>();
  const { t } = useTranslation();

  const handleLogin = () => navigate(Routes.AUTH_02_LOGIN);

  const handlePrivacy = async () => {
    await Linking.openURL('https://www.bertieapp.com/privacypolicy.html');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

          <View style={styles.illustrationContainer}>
            <Illustration name="welcome" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.welcome.email)}
          onPress={handleLogin}
        />
        <GoogleButton />
        {Platform.OS === 'ios' && <AppleSigninButton />}
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
  scrollContent: {
    flexGrow: 1,
    gap: 20,
    paddingTop: 20,
  },
  logo: {
    alignItems: 'center',
  },
  container: {
    gap: 20,
    width: '100%',
  },
  welcomeMessage: {
    gap: 20,
    alignItems: 'flex-start',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bottomArea: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Platform.OS === 'web' ? 20 : 20,
    gap: 5,
    alignItems: 'center',
  },
}));

export default WelcomeScreen;
