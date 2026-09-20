import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, View } from 'react-native';

import { setPendingSignup } from 'api/auth/pendingSignup';
import AuthPageShell from 'components/AuthPageShell';
import Button from 'components/Button';
import Input from 'components/Input';
import Logo from 'components/Logo';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

export interface RegisterPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.AUTH_03_REGISTER
> {}

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [mailError, setMailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const styles = useStyles();
  const { theme } = useTheme();
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

  const handleLogin = () => {
    navigate(Routes.AUTH_02_LOGIN);
  };

  const handleRegister = () => {
    const validRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (email.match(validRegex)) {
      if (checkPassword === password) {
        setPendingSignup({ email, password });
        navigate(Routes.AUTH_04_SET_PROFILE);
      } else {
        setPasswordError(true);
      }
    } else {
      setMailError(true);
    }
  };

  const handlePrivacy = () => {
    Linking.openURL('https://www.bertieapp.com/privacypolicy.html');
  };

  return (
    <AuthPageShell>
      <View style={styles.body}>
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
          <View style={styles.disclaimer}>
            <Text
              kind="littleText"
              text={t(translations.signup.agree)}
              style={styles.disclaimerText}
            />
            <Text
              kind="littleText"
              text={t(translations.signup.terms)}
              color={theme.colors.primary}
              onPress={handlePrivacy}
              style={styles.disclaimerLink}
            />
          </View>
          <Button
            kind="primary"
            text={t(translations.signup.button)}
            onPress={handleRegister}
          />
          <Pressable
            onPress={handleLogin}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.loginLink,
              pressed && styles.loginLinkPressed,
            ]}
          >
            <Text
              kind="button"
              text={t(translations.signup.login)}
              style={styles.loginLinkText}
            />
          </Pressable>
        </View>
      </View>
    </AuthPageShell>
  );
};

const useStyles = makeStyles(() => ({
  body: {
    flex: 1,
    gap: 20,
  },
  logo: {
    alignItems: 'center',
    paddingTop: 20,
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
    marginBottom: 20,
    gap: 12,
  },
  disclaimer: {
    gap: 2,
    paddingBottom: 4,
  },
  disclaimerText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  disclaimerLink: {
    textAlign: 'center',
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  loginLink: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  loginLinkPressed: {
    opacity: 0.55,
  },
  loginLinkText: {
    textAlign: 'center',
  },
}));

export default RegisterScreen;
