import { Routes } from 'navigation/routes';

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
