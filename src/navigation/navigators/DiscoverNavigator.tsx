import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { DISCOVER_ROUTES } from 'navigation/routes';
import type { DiscoverNavigatorParamList } from 'navigation/types';

import AddressScreen from 'screens/AddressScreen';
import BookshopScreen from 'screens/BookshopScreen';
import DiscoverScreen from 'screens/DiscoverScreen';

export const DiscoverStack =
  createNativeStackNavigator<DiscoverNavigatorParamList>();

export const DiscoverNavigator = () => (
  <DiscoverStack.Navigator
    id={undefined}
    screenOptions={{ headerShown: false, animation: 'none' }}
  >
    <DiscoverStack.Screen
      name={DISCOVER_ROUTES.DISCOVER_01_DISCOVER}
      component={DiscoverScreen}
    />
    <DiscoverStack.Screen
      name={DISCOVER_ROUTES.DISCOVER_02_ADDRESS}
      component={AddressScreen}
    />
    <DiscoverStack.Screen
      name={DISCOVER_ROUTES.DISCOVER_03_BOOKSHOP}
      component={BookshopScreen}
    />
  </DiscoverStack.Navigator>
);
