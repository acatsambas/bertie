import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import Input from 'components/Input';
import Logo from 'components/Logo';
import Text from 'components/Text';

import { AuthContext } from 'api/auth/AuthProvider';
import { isFirebaseError } from 'api/types';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export interface LoginPageProps
  extends StackNavigationProp<NavigationType, typeof Routes.AUTH_02_LOGIN> { }

const LoginScreen = () => {
  const styles = useStyles();
  const { navigate } = useNavigation<LoginPageProps>();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(AuthContext);

  const handleInputEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
  };

  const handleInputPassword = (value: string) => {
    setPassword(value);
  };

  const handleSignup = () => {
    navigate(Routes.AUTH_03_REGISTER);
  };

  const handleForgot = () => {
    navigate(Routes.AUTH_05_FORGOT);
  };

  const handlePressLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      if (isFirebaseError(error)) {
        console.error(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
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
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.login.button)}
          onPress={handlePressLogin}
        />
        <Button
          kind="tertiary"
          text={t(translations.login.create)}
          onPress={handleSignup}
        />
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
  logo: {
    alignItems: 'center',
    paddingTop: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  forgot: { alignItems: 'flex-end' },
  bottomArea: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
    gap: 20,
  },
}));

export default LoginScreen;
