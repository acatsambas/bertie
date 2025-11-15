import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { DiscoverNavigator } from 'navigation/navigators/DiscoverNavigator';
import { LibraryNavigator } from 'navigation/navigators/LibraryNavigator';
import { OrderNavigator } from 'navigation/navigators/OrderNavigator';
import { HOME_ROUTES } from 'navigation/routes';
import type { HomeNavigatorParamList } from 'navigation/types';

import BottomMenu from './components/BottomMenu';

export const HomeBottomTab = createBottomTabNavigator<HomeNavigatorParamList>();

export const HomeNavigator = () => (
  <HomeBottomTab.Navigator
    id={undefined}
    screenOptions={{ headerShown: false }}
    tabBar={() => <BottomMenu />}
  >
    <HomeBottomTab.Screen
      name={HOME_ROUTES.HOME_01_LIBRARY}
      component={LibraryNavigator}
    />
    <HomeBottomTab.Screen
      name={HOME_ROUTES.HOME_02_DISCOVER}
      component={DiscoverNavigator}
    />
    <HomeBottomTab.Screen
      name={HOME_ROUTES.HOME_03_ORDER}
      component={OrderNavigator}
    />
  </HomeBottomTab.Navigator>
);
