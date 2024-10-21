import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@rneui/themed';

import { translations } from '../../locales/translations';
import { View } from 'react-native';
import Text from '../../components/Text';
import Input from '../../components/Input';
import Button from '../../components/Button';

//TODO: Reset password doesn't work

const ResetScreen = () => {
  const [isReseted, setIsReseted] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [error, setError] = useState('');

  const styles = useStyles();
  const { t } = useTranslation();

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const handleNewPassword = (value: string) => {
    setNewPassword(value);
  };

  const handleNewPassword2 = (value: string) => {
    setNewPassword2(value);
  };

  const handleSave = () => {
    if (newPassword === newPassword2) {
      setIsReseted(true);
    } else {
      setError('Passwords do not match!');
    }
  };

  const handleDone = () => {};
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text text={t(translations.reset.title)} kind="header" />
        {!isReseted ? (
          <>
            <Text text={t(translations.reset.enterPassword)} kind="paragraph" />
            <Input
              placeholder={t(translations.reset.placeholder1)}
              kind="password"
              onChangeText={handlePassword}
            />
            <Text text={t(translations.reset.newPassword)} kind="paragraph" />
            <Input
              placeholder={t(translations.reset.placeholder2)}
              kind="password"
              onChangeText={handleNewPassword}
            />
            <Text
              text={t(translations.reset.confirmPassword)}
              kind="paragraph"
            />
            <Input
              placeholder={t(translations.reset.placeholder2)}
              kind="password"
              onChangeText={handleNewPassword2}
            />
            {error && (
              <View style={styles.error}>
                <Text text={error} kind="paragraph" />
              </View>
            )}
          </>
        ) : (
          <Text text={t(translations.reset.allDone)} kind="paragraph" />
        )}
      </View>
      <View style={styles.bottomArea}>
        {!isReseted ? (
          <Button
            text={t(translations.reset.button)}
            kind="primary"
            onPress={handleSave}
          />
        ) : (
          <Button
            text={t(translations.reset.done)}
            kind="primary"
            onPress={handleDone}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FDF9F6',
  },
  container: { paddingTop: 20, gap: 20 },
  error: {
    backgroundColor: '#FDEDED',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bottomArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
}));

export default ResetScreen;
