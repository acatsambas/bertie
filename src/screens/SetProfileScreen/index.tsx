import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AuthContext } from 'api/auth/AuthProvider';
import { clearPendingSignup, getPendingSignup } from 'api/auth/pendingSignup';
import { isFirebaseError } from 'api/types';
import AuthPageShell from 'components/AuthPageShell';
import Button from 'components/Button';
import Input from 'components/Input';
import Logo from 'components/Logo';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import type { NavigationType } from 'navigation/types';

type SetProfileNavigation = StackNavigationProp<
  NavigationType,
  typeof Routes.AUTH_04_SET_PROFILE
>;

const SetProfileScreen = () => {
  const { replace } = useNavigation<SetProfileNavigation>();
  const [pendingSignup] = useState(() => getPendingSignup());
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');

  const styles = useStyles();
  const { register } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!pendingSignup) {
      replace(Routes.AUTH_03_REGISTER);
    }
  }, [pendingSignup, replace]);

  useEffect(() => {
    return () => {
      clearPendingSignup();
    };
  }, []);

  const canSubmit = givenName.length > 0 && familyName.length > 0;

  const handleRegister = async () => {
    if (!pendingSignup || !canSubmit) {
      return;
    }

    try {
      await register(
        pendingSignup.email,
        pendingSignup.password,
        givenName,
        familyName,
      );
      clearPendingSignup();
    } catch (error) {
      if (isFirebaseError(error)) {
        console.error(error);
      }
    }
  };

  const handleGivenName = (value: string) => {
    setGivenName(value.trim());
  };

  const handleFamilyName = (value: string) => {
    setFamilyName(value.trim());
  };

  if (!pendingSignup) {
    return null;
  }

  return (
    <AuthPageShell>
      <View style={styles.body}>
        <View style={styles.logo}>
          <Logo />
        </View>

        <View style={styles.container}>
          <Text kind="header" text={t(translations.signup.profile.title)} />
          <View>
            <Input
              placeholder={t(translations.signup.profile.firstName)}
              onChangeText={handleGivenName}
              value={givenName}
            />
            <Input
              placeholder={t(translations.signup.profile.lastName)}
              onChangeText={handleFamilyName}
              value={familyName}
            />
          </View>
        </View>

        <View style={styles.bottomArea}>
          <Button
            kind="primary"
            text={t(translations.signup.profile.button)}
            onPress={handleRegister}
            disabled={!canSubmit}
          />
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
  bottomArea: { flex: 1, justifyContent: 'flex-end', marginBottom: 20 },
}));

export default SetProfileScreen;
