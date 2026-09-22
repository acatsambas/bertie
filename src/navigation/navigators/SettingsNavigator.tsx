import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { makeStyles } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import React from 'react';
import { View } from 'react-native';

import { SETTINGS_ROUTES } from 'navigation/routes';
import type { SettingsNavigatorParamList } from 'navigation/types';
import AddressScreen from 'screens/AddressScreen';
import DeleteScreen from 'screens/DeleteScreen';
import GoodreadsImportScreen from 'screens/GoodreadsImportScreen';
import ResetScreen from 'screens/ResetScreen';
import SettingsScreen from 'screens/SettingsScreen';

import SideRail from './components/SideRail';

export const SettingsStack =
  createNativeStackNavigator<SettingsNavigatorParamList>();

export const SettingsNavigator = () => {
  const isDesktop = useIsDesktop();
  const styles = useStyles();

  const navigator = (
    <SettingsStack.Navigator
      id={undefined}
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
      <SettingsStack.Screen
        name={SETTINGS_ROUTES.SETTINGS_05_IMPORT_GOODREADS}
        component={GoodreadsImportScreen}
      />
    </SettingsStack.Navigator>
  );

  // Settings lives outside the home tabs, so on desktop the rail has to be
  // remounted here — same pattern as the root-level book screen.
  if (!isDesktop) return navigator;

  return (
    <View style={styles.desktopShell}>
      <SideRail />
      <View style={styles.content}>{navigator}</View>
    </View>
  );
};

const useStyles = makeStyles({
  desktopShell: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});
