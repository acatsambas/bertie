import { useRoute } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthContext } from 'api/auth/AuthProvider';
import { isFirebaseError } from 'api/types';
import Button from 'components/Button';
import Input from 'components/Input';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import {
  SettingsFormError,
  SettingsFormFields,
  SettingsFormIntro,
} from 'screens/SettingsScreen/SettingsForm';
import { SettingsPageShell } from 'screens/SettingsScreen/SettingsPageShell';

const resetErrorKey = (code: string) => {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return translations.reset.errors.wrongPassword;
    case 'auth/weak-password':
      return translations.reset.errors.weakPassword;
    case 'auth/too-many-requests':
      return translations.reset.errors.tooManyRequests;
    case 'auth/network-request-failed':
      return translations.reset.errors.network;
    default:
      return translations.reset.errors.generic;
  }
};

const ResetScreen = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  const [isReseted, setIsReseted] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { t } = useTranslation();
  const route = useRoute();
  const { changePassword } = useContext(AuthContext);

  const handlePassword = (value: string) => {
    setPassword(value);
    setErrorKey(null);
  };

  const handleNewPassword = (value: string) => {
    setNewPassword(value);
    setErrorKey(null);
  };

  const handleNewPassword2 = (value: string) => {
    setNewPassword2(value);
    setErrorKey(null);
  };

  const handleSave = async () => {
    setErrorKey(null);

    if (newPassword !== newPassword2) {
      setErrorKey(translations.reset.errors.mismatch);
      return;
    }

    if (newPassword.length < 6) {
      setErrorKey(translations.reset.errors.weakPassword);
      return;
    }

    setSaving(true);
    try {
      await changePassword(password, newPassword);
      setIsReseted(true);
    } catch (error) {
      if (isFirebaseError(error)) {
        setErrorKey(resetErrorKey(error.code));
        return;
      }
      setErrorKey(translations.reset.errors.generic);
    } finally {
      setSaving(false);
    }
  };

  const handleDone = () => {
    goBackOrFallback(navigation, route.name);
  };

  return (
    <SettingsPageShell
      title={t(translations.reset.title)}
      onBack={() => goBackOrFallback(navigation, route.name)}
      footer={
        !isReseted ? (
          <Button
            text={t(translations.reset.button)}
            kind="primary"
            onPress={handleSave}
            disabled={saving}
          />
        ) : (
          <Button
            text={t(translations.reset.done)}
            kind="primary"
            onPress={handleDone}
          />
        )
      }
    >
      {!isReseted ? (
        <>
          <SettingsFormIntro text={t(translations.reset.description)} />
          <SettingsFormFields label={t(translations.reset.sectionCurrent)}>
            <Input
              marginTop={0}
              placeholder={t(translations.reset.currentPassword)}
              kind="password"
              icon="password"
              onChangeText={handlePassword}
              value={password}
              textContentType="password"
              autoComplete="password"
            />
          </SettingsFormFields>
          <SettingsFormFields label={t(translations.reset.sectionNew)}>
            <Input
              marginTop={0}
              placeholder={t(translations.reset.newPassword)}
              kind="password"
              icon="password"
              onChangeText={handleNewPassword}
              value={newPassword}
              textContentType="newPassword"
              autoComplete="password-new"
            />
            <Input
              marginTop={0}
              placeholder={t(translations.reset.confirmPassword)}
              kind="password"
              icon="password"
              onChangeText={handleNewPassword2}
              value={newPassword2}
              textContentType="newPassword"
              autoComplete="password-new"
            />
          </SettingsFormFields>
          {errorKey ? <SettingsFormError text={t(errorKey)} /> : null}
        </>
      ) : (
        <Text kind="paragraph" text={t(translations.reset.allDone)} />
      )}
    </SettingsPageShell>
  );
};

export default ResetScreen;
