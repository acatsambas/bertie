import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { APP_ROUTES } from 'navigation/routes';
import type { AppNavigatorParamList } from 'navigation/types';

import { translations } from 'locales/translations';

import { HomeNavigator } from './HomeNavigator';
import { SettingsNavigator } from './SettingsNavigator';

export const AppStack = createNativeStackNavigator<AppNavigatorParamList>();

const AppNavigator = () => {
  const { t } = useTranslation();

  return (
    <AppStack.Navigator
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <AppStack.Screen
        name={APP_ROUTES.APP_01_HOME}
        component={HomeNavigator}
        options={{ title: t(translations.library.title) }}
      />
      <AppStack.Screen
        name={APP_ROUTES.APP_02_SETTINGS}
        component={SettingsNavigator}
        options={{ title: t(translations.settings.title) }}
      />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
