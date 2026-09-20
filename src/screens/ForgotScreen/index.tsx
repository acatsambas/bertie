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
import { useToast } from 'contexts/ToastContext';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

export interface ForgotPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.AUTH_05_FORGOT
> {}

const forgotErrorKey = (code: string) => {
  switch (code) {
    case 'auth/invalid-email':
      return translations.forgot.errors.invalidEmail;
    case 'auth/too-many-requests':
      return translations.forgot.errors.tooManyRequests;
    case 'auth/network-request-failed':
      return translations.forgot.errors.network;
    default:
      return translations.forgot.errors.generic;
  }
};

const ForgotScreen = () => {
  const { forgot } = useContext(AuthContext);
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const { t } = useTranslation();
  const styles = useStyles();
  const { navigate } = useNavigation<ForgotPageProps>();

  const handleInputEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
    setErrorKey(null);
  };

  const goToLogin = () => {
    navigate(Routes.AUTH_02_LOGIN);
  };

  const handleForgotSuccess = () => {
    showToast(t(translations.forgot.success));
    goToLogin();
  };

  const handleForgot = async () => {
    setErrorKey(null);

    const validRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!email.match(validRegex)) {
      setErrorKey(translations.forgot.errors.invalidEmail);
      return;
    }

    try {
      await forgot(email);
      handleForgotSuccess();
    } catch (error) {
      // Don't reveal whether the email is registered.
      if (isFirebaseError(error) && error.code === 'auth/user-not-found') {
        handleForgotSuccess();
        return;
      }

      if (isFirebaseError(error)) {
        setErrorKey(forgotErrorKey(error.code));
        return;
      }

      setErrorKey(translations.forgot.errors.generic);
    }
  };

  return (
    <AuthPageShell>
      <View style={styles.body}>
        <View style={styles.logo}>
          <Logo />
        </View>
        <View style={styles.container}>
          <Text kind="header" text={t(translations.forgot.title)} />
          <View>
            <Text kind="paragraph" text={t(translations.forgot.enterEmail)} />
            <Text kind="paragraph" text={t(translations.forgot.sendEmail)} />
          </View>
          <Input
            placeholder={t(translations.forgot.placeholder)}
            kind="email"
            icon="email"
            onChangeText={handleInputEmail}
            value={email}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errorKey && (
            <View style={styles.error}>
              <Text kind="paragraph" text={t(errorKey)} />
            </View>
          )}
        </View>
        <View style={styles.bottomArea}>
          <Button
            kind="primary"
            text={t(translations.forgot.button)}
            onPress={handleForgot}
          />
          <Pressable
            onPress={goToLogin}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.backLink,
              pressed && styles.backLinkPressed,
            ]}
          >
            <Text
              kind="button"
              text={t(translations.forgot.backToLogin)}
              style={styles.backLinkText}
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
  backLink: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  backLinkPressed: {
    opacity: 0.55,
  },
  backLinkText: {
    textAlign: 'center',
  },
}));

export default ForgotScreen;
