import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { SETTINGS_ROUTES } from 'navigation/routes';
import type { SettingsNavigatorParamList } from 'navigation/types';

import AddressScreen from 'screens/AddressScreen';
import DeleteScreen from 'screens/DeleteScreen';
import ResetScreen from 'screens/ResetScreen';
import SettingsScreen from 'screens/SettingsScreen';

export const SettingsStack =
  createNativeStackNavigator<SettingsNavigatorParamList>();

export const SettingsNavigator = () => (
  <SettingsStack.Navigator
    screenOptions={{ headerShown: false, animation: 'none' }}
  >
    <SettingsStack.Screen
      name={SETTINGS_ROUTES.SETTINGS_01_SETTINGS}
      component={SettingsScreen}
    />
    <SettingsStack.Screen
      name={SETTINGS_ROUTES.SETTINGS_02_CHANGE_ADDRESS}
      component={AddressScreen}
    />
    <SettingsStack.Screen
      name={SETTINGS_ROUTES.SETTINGS_03_RESET_PASSWORD}
      component={ResetScreen}
    />
    <SettingsStack.Screen
      name={SETTINGS_ROUTES.SETTINGS_04_DELETE_ACCOUNT}
      component={DeleteScreen}
    />
  </SettingsStack.Navigator>
);
