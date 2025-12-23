import { NavigatorScreenParams } from '@react-navigation/native';

import { Shop, UserBook } from 'api/app/types';
import { BookResult } from 'api/google-books/search';

import { Routes } from './routes';

export type AppNavigatorParamList = {
  [Routes.APP_01_HOME]: undefined;
  [Routes.APP_02_SETTINGS]: NavigatorScreenParams<SettingsNavigatorParamList>;
};

export type AuthNavigatorParamList = {
  [Routes.AUTH_01_WELCOME]: undefined;
  [Routes.AUTH_02_LOGIN]: undefined;
  [Routes.AUTH_03_REGISTER]: undefined;
  [Routes.AUTH_04_SET_PROFILE]: { email: string; password: string };
  [Routes.AUTH_05_FORGOT]: undefined;
};

export type HomeNavigatorParamList = {
  [Routes.HOME_01_LIBRARY]: undefined;
  [Routes.HOME_02_DISCOVER]: undefined;
  [Routes.HOME_03_ORDER]: undefined;
};

export type LibraryNavigatorParamList = {
  [Routes.LIBRARY_01_LIBRARY]: undefined;
  [Routes.LIBRARY_02_BOOK]: {
    book: BookResult;
  };
  [Routes.LIBRARY_03_SEARCH]: undefined;
};

export type OrderNavigatorParamList = {
  [Routes.ORDER_01_ORDER]: undefined;
  [Routes.ORDER_02_ORDER_SHOP]: {
    books: (UserBook & BookResult)[];
  };
  [Routes.ORDER_03_ADDRESS_SCREEN]: undefined;
  [Routes.ORDER_04_BOOKSHOP]: {
    shop: Shop;
  };
  [Routes.ORDER_05_EMAIL_SCREEN]: undefined;
  [Routes.ORDER_06_ORDER_PLACED]: {
    bookshopName?: string;
  };
};

export type DiscoverNavigatorParamList = {
  [Routes.DISCOVER_01_DISCOVER]: undefined;
  [Routes.DISCOVER_02_ADDRESS]: undefined;
  [Routes.DISCOVER_03_BOOKSHOP]: {
    shop: Shop;
  };
};

export type SettingsNavigatorParamList = {
  [Routes.SETTINGS_01_SETTINGS]: undefined;
  [Routes.SETTINGS_02_CHANGE_ADDRESS]: undefined;
  [Routes.SETTINGS_03_RESET_PASSWORD]: undefined;
  [Routes.SETTINGS_04_DELETE_ACCOUNT]: undefined;
};

export type RootNavigatorParamList = {
  [Routes.ROOT_01_AUTH]: NavigatorScreenParams<AuthNavigatorParamList>;
  [Routes.ROOT_02_APP]: NavigatorScreenParams<AppNavigatorParamList>;
  [Routes.ROOT_03_DATA_REQUEST]: undefined;
  [Routes.ROOT_04_SUPPORT]: undefined;
  [Routes.ROOT_05_PRIVACY_POLICY]: undefined;
};

export type NavigationType = HomeNavigatorParamList &
  LibraryNavigatorParamList &
  OrderNavigatorParamList &
  DiscoverNavigatorParamList &
  AuthNavigatorParamList &
  AppNavigatorParamList &
  SettingsNavigatorParamList &
  RootNavigatorParamList;
