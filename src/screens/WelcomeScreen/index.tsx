import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';

import { useGuest } from 'api/guest/GuestProvider';
import AppleSigninButton from 'components/AuthButtons/Apple';
import GoogleButton from 'components/AuthButtons/GoogleButton';
import AuthPageShell from 'components/AuthPageShell';
import Button from 'components/Button';
import Illustration from 'components/Illustration';
import Logo from 'components/Logo';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import type { NavigationType } from 'navigation/types';

export interface WelcomePageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.AUTH_01_WELCOME
> {}

const WelcomeScreen = () => {
  const styles = useStyles();
  const { height: windowHeight } = useWindowDimensions();
  const { navigate } = useNavigation<WelcomePageProps>();
  const { t } = useTranslation();
  const { enterGuestMode } = useGuest();

  // Cap the books art so leftover flex space becomes breathing room, not a giant image.
  const illustrationMaxHeight = Math.round(windowHeight * 0.28);

  const handleLogin = () => navigate(Routes.AUTH_02_LOGIN);

  const handleExplore = async () => {
    await enterGuestMode();
  };

  const handlePrivacy = async () => {
    await Linking.openURL('https://www.bertieapp.com/privacypolicy.html');
  };

  return (
    <AuthPageShell>
      <View style={styles.main}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Logo />
          </View>

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

        <View style={styles.illustrationContainer}>
          <Illustration
            name="welcome"
            style={{
              width: '100%',
              height: illustrationMaxHeight,
              maxHeight: illustrationMaxHeight,
            }}
          />
        </View>
      </View>

      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          icon="email"
          text={t(translations.welcome.email)}
          onPress={handleLogin}
        />
        <GoogleButton />
        {Platform.OS === 'ios' && <AppleSigninButton />}
        <Pressable
          onPress={handleExplore}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.explore,
            pressed && styles.explorePressed,
          ]}
        >
          <Text
            kind="button"
            text={t(translations.welcome.explore)}
            style={styles.exploreText}
          />
        </Pressable>
      </View>
    </AuthPageShell>
  );
};

const useStyles = makeStyles(() => ({
  main: {
    flex: 1,
    minHeight: 0,
    gap: 16,
    paddingTop: 20,
  },
  header: {
    gap: 16,
    flexShrink: 0,
  },
  logo: {
    alignItems: 'center',
  },
  welcomeMessage: {
    gap: 16,
    alignItems: 'flex-start',
  },
  illustrationContainer: {
    flex: 1,
    minHeight: 96,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomArea: {
    flexShrink: 0,
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },
  explore: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  explorePressed: {
    opacity: 0.55,
  },
  exploreText: {
    textAlign: 'center',
  },
}));

export default WelcomeScreen;
