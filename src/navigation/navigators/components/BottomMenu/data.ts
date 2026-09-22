import type { NavigatorScreenParams } from '@react-navigation/native';

import { Routes } from 'navigation/routes';
import type { HomeNavigatorParamList } from 'navigation/types';

export const menuItems = [
  {
    icon: 'myList',
    title: 'My list',
    screen: Routes.HOME_01_LIBRARY,
  },
  {
    icon: 'discover',
    title: 'Discover',
    screen: Routes.HOME_02_DISCOVER,
  },
  {
    icon: 'order',
    title: 'Order',
    screen: Routes.HOME_03_ORDER,
  },
] as const;

export type HomeTabScreen = (typeof menuItems)[number]['screen'];

export const homeTabNavigateParams = (
  screen: HomeTabScreen,
): NavigatorScreenParams<HomeNavigatorParamList> => {
  switch (screen) {
    case Routes.HOME_01_LIBRARY:
      return {
        screen: Routes.HOME_01_LIBRARY,
        params: { screen: Routes.LIBRARY_01_LIBRARY },
      };
    case Routes.HOME_02_DISCOVER:
      return {
        screen: Routes.HOME_02_DISCOVER,
        params: { screen: Routes.DISCOVER_01_DISCOVER },
      };
    case Routes.HOME_03_ORDER:
      return {
        screen: Routes.HOME_03_ORDER,
        params: { screen: Routes.ORDER_01_ORDER },
      };
  }
};
