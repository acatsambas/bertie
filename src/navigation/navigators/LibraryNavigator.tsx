import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { LIBRARY_ROUTES } from 'navigation/routes';
import type { LibraryNavigatorParamList } from 'navigation/types';

import BookScreen from 'screens/BookScreen';
import LibraryScreen from 'screens/LibraryScreen';
import SearchBookScreen from 'screens/SearchBookScreen';

export const LibraryStack =
  createNativeStackNavigator<LibraryNavigatorParamList>();

export const LibraryNavigator = () => (
  <LibraryStack.Navigator
    id={undefined}
    screenOptions={{ headerShown: false, animation: 'none' }}
  >
    <LibraryStack.Screen
      name={LIBRARY_ROUTES.LIBRARY_01_LIBRARY}
      component={LibraryScreen}
    />
    <LibraryStack.Screen
      name={LIBRARY_ROUTES.LIBRARY_02_BOOK}
      component={BookScreen}
    />
    <LibraryStack.Screen
      name={LIBRARY_ROUTES.LIBRARY_03_SEARCH}
      component={SearchBookScreen}
    />
  </LibraryStack.Navigator>
);
