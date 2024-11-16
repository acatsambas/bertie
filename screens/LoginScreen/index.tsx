import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '../../api/auth/AuthProvider';
import { isFirebaseError } from '../../api/types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Logo from '../../components/Logo';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';
import { AuthNavigatorParamList } from '../../navigation/AuthStack/params';

export interface LoginPageProps
  extends StackNavigationProp<AuthNavigatorParamList, 'Login'> {}

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
    navigate('Register');
  };

  const handleForgot = () => {
    navigate('Forgot');
  };

  const handlePressLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      // TODO: handle error
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
