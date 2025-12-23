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
        <View style={styles.topContent}>
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
          </View>
        </View>
        <View style={styles.illustrationContainer}>
          <Illustration name="welcome" />
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
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  topContent: {
    paddingTop: 20,
    gap: 20,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: Platform.OS === 'web' ? 300 : 200,
    paddingVertical: Platform.OS === 'web' ? 40 : 20,
  },
  bottomArea: {
    justifyContent: 'flex-end',
    marginBottom: Platform.OS === 'web' ? 20 : 20,
    gap: 5,
    alignItems: 'center',
  },
}));

export default WelcomeScreen;
