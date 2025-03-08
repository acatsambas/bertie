import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import Input from 'components/Input';
import Logo from 'components/Logo';
import Text from 'components/Text';

import { AuthContext } from 'api/auth/AuthProvider';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export interface ForgotPageProps
  extends StackNavigationProp<NavigationType, typeof Routes.AUTH_05_FORGOT> {}

const ForgotScreen = () => {
  const { forgot } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(false);

  const { t } = useTranslation();
  const styles = useStyles();
  const { navigate } = useNavigation<ForgotPageProps>();

  const handleInputEmail = (value: string) => {
    setEmail(value.toLowerCase().trim());
  };

  const handleForgot = async () => {
    const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (email.match(validRegex)) {
      setIsSent(true);
      await forgot(email);
    } else {
      setError(true);
    }
  };

  const handleDone = () => {
    navigate(Routes.AUTH_01_WELCOME);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.logo}>
        <Logo />
      </View>
      <View style={styles.container}>
        <Text kind="header" text={t(translations.forgot.title)} />
        {!isSent ? (
          <>
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
            {error && (
              <View style={styles.error}>
                <Text kind="paragraph" text={t(translations.forgot.error)} />
              </View>
            )}
          </>
        ) : (
          <Text kind="paragraph" text={t(translations.forgot.success)} />
        )}
      </View>
      <View style={styles.bottomArea}>
        {!isSent ? (
          <Button
            kind="primary"
            text={t(translations.forgot.button)}
            onPress={handleForgot}
          />
        ) : (
          <Button
            kind="primary"
            text={t(translations.forgot.done)}
            onPress={handleDone}
          />
        )}
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
  error: {
    backgroundColor: '#FDEDED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bottomArea: { flex: 1, justifyContent: 'flex-end', marginBottom: 20 },
}));

export default ForgotScreen;
