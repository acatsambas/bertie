import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { usePWAInstall } from 'hooks/usePWAInstall';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Linking, Platform, View } from 'react-native';

import Button from 'components/Button';
import Input from 'components/Input';
import Logo from 'components/Logo';
import PWAInstallModal from 'components/PWAInstallModal';
import Text from 'components/Text';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export interface RegisterPageProps
  extends StackNavigationProp<NavigationType, typeof Routes.AUTH_03_REGISTER> {}

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [mailError, setMailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const styles = useStyles();
  const { navigate } = useNavigation<RegisterPageProps>();
  const { t } = useTranslation();

  const handleInputEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
    setMailError(false);
  };

  const handleInputPassword = (value: string) => {
    setPassword(value);
    setPasswordError(false);
  };

  const handleInputPasswordCheck = (value: string) => {
    setCheckPassword(value);
    setPasswordError(false);
  };

  const { isInstallable, promptInstall } = usePWAInstall();
  const [showPwaInstall, setShowPwaInstall] = useState(false);

  const handleRegister = () => {
    const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (email.match(validRegex)) {
      if (checkPassword === password) {
        navigate(Routes.AUTH_04_SET_PROFILE, {
          email: email,
          password: password,
        });

        if (isInstallable) {
          setShowPwaInstall(true);
        }
      } else {
        setPasswordError(true);
      }
    } else {
      setMailError(true);
    }
  };

  // const handleExplore = () => {
  //   // TODO: anonymousLogin
  // };

  const handlePrivacy = () => {
    Linking.openURL('https://www.bertieapp.com/privacypolicy.html');
  };
  return (
    <KeyboardAvoidingView style={styles.safeAreaView} behavior="height">
      <View style={styles.logo}>
        <Logo />
      </View>

      <View style={styles.container}>
        <Text kind="header" text={t(translations.signup.title)} />
        <View>
          <Input
            placeholder={t(translations.signup.email)}
            icon="email"
            onChangeText={handleInputEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
          />
          <Input
            placeholder={t(translations.signup.password)}
            kind="password"
            icon="password"
            onChangeText={handleInputPassword}
            textContentType="password"
            value={password}
          />
          <Input
            placeholder={t(translations.signup.password2)}
            kind="password"
            icon="password"
            onChangeText={handleInputPasswordCheck}
            textContentType="password"
            value={checkPassword}
          />
          <View>
            <Text kind="paragraph" text={t(translations.signup.agree)} />
            <Text
              kind="button"
              text={t(translations.signup.terms)}
              onPress={handlePrivacy}
            />
          </View>
        </View>
        {mailError && (
          <View style={styles.error}>
            <Text kind="paragraph" text={t(translations.signup.mailError)} />
          </View>
        )}
        {passwordError && (
          <View style={styles.error}>
            <Text kind="paragraph" text={t(translations.signup.pwNoMatch)} />
          </View>
        )}
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.signup.button)}
          onPress={handleRegister}
        />
        {/* <Button
          kind="tertiary"
          text={t(translations.signup.explore)}
          onPress={handleExplore}
        /> */}
      </View>
      <PWAInstallModal
        isVisible={showPwaInstall}
        onClose={() => setShowPwaInstall(false)}
        onInstall={() => {
          setShowPwaInstall(false);
          promptInstall();
        }}
      />
    </KeyboardAvoidingView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  logo: {
    alignItems: 'center',
    paddingTop: 50,
  },
  container: { paddingTop: 20, gap: 20 },
  error: {
    backgroundColor: '#FDEDED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bottomArea: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
    gap: 20,
  },
}));

export default RegisterScreen;
