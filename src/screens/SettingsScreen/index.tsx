import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { isDesktopPlatform, useIsDesktop } from 'hooks/useIsDesktop';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { AuthContext } from 'api/auth/AuthProvider';
import { useGuest } from 'api/guest/GuestProvider';
import Button from 'components/Button';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import { Routes } from 'navigation/routes';
import type { NavigationType } from 'navigation/types';

import { SettingsPageShell } from './SettingsPageShell';
import { SettingsProfileHeader } from './SettingsProfileHeader';
import { SettingsRow, SettingsSection } from './SettingsRow';

export interface SettingsPageProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.SETTINGS_01_SETTINGS
> {}

const SettingsScreen = ({ navigation }: { navigation: SettingsPageProps }) => {
  const { navigate } = useNavigation<SettingsPageProps>();
  const { t } = useTranslation();

  const { logout, user } = useContext(AuthContext);
  const { isGuest, exitGuestMode } = useGuest();
  const queryClient = useQueryClient();
  const isDesktop = useIsDesktop();

  const providerIds = user?.providerData.map(p => p.providerId) ?? [];
  const hasPassword = providerIds.includes('password');

  const showGoodreads = isDesktopPlatform() && !isGuest;
  const showPassword = hasPassword;
  const showDelete = !isGuest;

  const accountRows = [
    showGoodreads ? 'goodreads' : null,
    'address',
    showPassword ? 'password' : null,
    showDelete ? 'delete' : null,
  ].filter(Boolean) as Array<'goodreads' | 'address' | 'password' | 'delete'>;

  const handleLogout = async () => {
    if (isGuest) {
      await exitGuestMode();
    } else {
      await logout();
    }
    queryClient.clear();
  };

  const handleExit = () => {
    goBackOrFallback(navigation, Routes.SETTINGS_01_SETTINGS);
  };

  const version = Constants.expoConfig?.version ?? '';

  return (
    <SettingsPageShell
      title={t(translations.settings.title)}
      onBack={isDesktop ? undefined : handleExit}
      footer={
        <Button
          kind="primary"
          text={t(translations.settings.signout)}
          onPress={handleLogout}
        />
      }
    >
      <SettingsProfileHeader />

      {accountRows.length > 0 ? (
        <SettingsSection title={t(translations.settings.sections.account)}>
          {accountRows.map((row, index) => {
            const isLast = index === accountRows.length - 1;
            switch (row) {
              case 'goodreads':
                return (
                  <SettingsRow
                    key={row}
                    icon="import"
                    title={t(translations.settings.importGoodreads)}
                    isLast={isLast}
                    onPress={() =>
                      navigate(Routes.SETTINGS_05_IMPORT_GOODREADS)
                    }
                  />
                );
              case 'address':
                return (
                  <SettingsRow
                    key={row}
                    icon="address"
                    title={t(translations.settings.changeAddress)}
                    isLast={isLast}
                    onPress={() => navigate(Routes.SETTINGS_02_CHANGE_ADDRESS)}
                  />
                );
              case 'password':
                return (
                  <SettingsRow
                    key={row}
                    icon="password"
                    title={t(translations.settings.reset)}
                    isLast={isLast}
                    onPress={() => navigate(Routes.SETTINGS_03_RESET_PASSWORD)}
                  />
                );
              case 'delete':
                return (
                  <SettingsRow
                    key={row}
                    icon="delete"
                    title={t(translations.settings.delete)}
                    isLast={isLast}
                    onPress={() => navigate(Routes.SETTINGS_04_DELETE_ACCOUNT)}
                  />
                );
            }
          })}
        </SettingsSection>
      ) : null}

      <SettingsSection title={t(translations.settings.sections.support)}>
        <SettingsRow
          icon="email"
          title={t(translations.settings.contactAddress)}
          isLast={false}
          onPress={() =>
            Linking.openURL(`mailto:${t(translations.settings.contactAddress)}`)
          }
        />
        <SettingsRow
          icon="info"
          title={t(translations.settings.versionLabel)}
          description={version}
          isLast
        />
      </SettingsSection>
    </SettingsPageShell>
  );
};

export default SettingsScreen;
