import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { AuthContext } from 'api/auth/AuthProvider';
import { isFirebaseError } from 'api/types';
import AuthPageShell from 'components/AuthPageShell';
import Button from 'components/Button';
import Input from 'components/Input';
import Logo from 'components/Logo';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

export interface LoginPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.AUTH_02_LOGIN
> {}

const loginErrorKey = (code: string) => {
  switch (code) {
    case 'auth/invalid-email':
      return translations.login.errors.invalidEmail;
    case 'auth/user-not-found':
      return translations.login.errors.userNotFound;
    case 'auth/wrong-password':
      return translations.login.errors.wrongPassword;
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return translations.login.errors.invalidCredential;
    case 'auth/user-disabled':
      return translations.login.errors.userDisabled;
    case 'auth/too-many-requests':
      return translations.login.errors.tooManyRequests;
    case 'auth/network-request-failed':
      return translations.login.errors.network;
    default:
      return translations.login.errors.generic;
  }
};

const LoginScreen = () => {
  const styles = useStyles();
  const { navigate } = useNavigation<LoginPageProps>();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const { login } = useContext(AuthContext);

  const handleInputEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
    setErrorKey(null);
  };

  const handleInputPassword = (value: string) => {
    setPassword(value);
    setErrorKey(null);
  };

  const handleSignup = () => {
    navigate(Routes.AUTH_03_REGISTER);
  };

  const handleForgot = () => {
    navigate(Routes.AUTH_05_FORGOT);
  };

  const handlePressLogin = async () => {
    setErrorKey(null);
    try {
      await login(email, password);
    } catch (error) {
      if (isFirebaseError(error)) {
        setErrorKey(loginErrorKey(error.code));
        return;
      }
      setErrorKey(translations.login.errors.generic);
    }
  };

  return (
    <AuthPageShell>
      <View style={styles.body}>
        <View style={styles.logo}>
          <Logo />
        </View>

        <View style={styles.container}>
          <Text kind="header" text={t(translations.login.title)} />
          <View>
            <Input
              placeholder={t(translations.login.email)}
              icon="email"
              onChangeText={handleInputEmail}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
            />
            <Input
              placeholder={t(translations.login.password)}
              kind="password"
              icon="password"
              onChangeText={handleInputPassword}
              textContentType="password"
              value={password}
            />
            <View style={styles.forgot}>
              <Text
                kind="button"
                text={t(translations.login.forgot)}
                onPress={handleForgot}
              />
            </View>
          </View>
          {errorKey && (
            <View style={styles.error}>
              <Text kind="paragraph" text={t(errorKey)} />
            </View>
          )}
        </View>
        <View style={styles.bottomArea}>
          <Button
            kind="primary"
            text={t(translations.login.button)}
            onPress={handlePressLogin}
          />
          <Pressable
            onPress={handleSignup}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.createLink,
              pressed && styles.createLinkPressed,
            ]}
          >
            <Text
              kind="button"
              text={t(translations.login.create)}
              style={styles.createLinkText}
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
  forgot: { alignItems: 'flex-end' },
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
  createLink: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  createLinkPressed: {
    opacity: 0.55,
  },
  createLinkText: {
    textAlign: 'center',
  },
}));

export default LoginScreen;
