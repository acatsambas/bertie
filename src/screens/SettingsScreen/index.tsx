import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useIsDesktop } from 'hooks/useIsDesktop';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from 'api/auth/AuthProvider';
import { useGuest } from 'api/guest/GuestProvider';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';
import type { NavigationType } from 'navigation/types';

export interface SettingsPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.SETTINGS_01_SETTINGS
> {}

const SettingsScreen = ({ navigation }) => {
  const { navigate } = useNavigation<SettingsPageProps>();
  const { t } = useTranslation();
  const styles = useStyles();

  const { logout, user } = useContext(AuthContext);
  const { isGuest, exitGuestMode } = useGuest();
  const queryClient = useQueryClient();
  const isDesktop = useIsDesktop();
  const handleLogout = async () => {
    // A guest has no session to sign out of, just the local flag.
    if (isGuest) {
      await exitGuestMode();
    } else {
      await logout();
    }
    queryClient.clear();
  };

  const handleChangeAddress = () => {
    navigate(Routes.SETTINGS_02_CHANGE_ADDRESS);
  };

  const handlePassword = () => {
    navigate(Routes.SETTINGS_03_RESET_PASSWORD);
  };

  const handleDelete = () => {
    navigate(Routes.SETTINGS_04_DELETE_ACCOUNT);
  };

  const handleImportGoodreads = () => {
    navigate(Routes.SETTINGS_05_IMPORT_GOODREADS);
  };

  const handleExit = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon icon="back" onPress={handleExit} />
          <Text kind="bigHeader" text={t(translations.settings.title)} />
        </View>
        <Button
          kind="secondary"
          text={t(translations.settings.contactAddress)}
          icon="email"
          onPress={() =>
            Linking.openURL(`mailto:${t(translations.settings.contactAddress)}`)
          }
        />
        <View style={styles.buttonsArea}>
          {/* Desktop only for now: it needs a CSV from the Goodreads site. */}
          {isDesktop && !isGuest && (
            <Button
              kind="secondary"
              onPress={handleImportGoodreads}
              text={t(translations.settings.importGoodreads)}
              icon="import"
            />
          )}
          <Button
            kind="secondary"
            onPress={handleChangeAddress}
            text={t(translations.settings.changeAddress)}
            icon="address"
          />
          {user?.providerData?.[0]?.providerId === 'password' && (
            <Button
              kind="secondary"
              onPress={handlePassword}
              text={t(translations.settings.reset)}
              icon="password"
            />
          )}
          {!isGuest && (
            <Button
              kind="secondary"
              onPress={handleDelete}
              text={t(translations.settings.delete)}
              icon="delete"
            />
          )}
        </View>
      </View>
      <View style={styles.bottomArea}>
        <Button
          kind="primary"
          text={t(translations.settings.signout)}
          onPress={handleLogout}
        />
        <Text
          kind="paragraph"
          text={t(translations.settings.version, {
            version: Constants.expoConfig?.version ?? '',
          })}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: { paddingTop: 20, gap: 20 },
  buttonsArea: { gap: 10, marginTop: 20 },
  bottomArea: { flex: 1, justifyContent: 'flex-end', gap: 20 },
}));

export default SettingsScreen;
