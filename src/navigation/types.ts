import { NavigatorScreenParams } from '@react-navigation/native';

import { Shop, UserBook } from 'api/app/types';
import { BookResult } from 'api/google-books/search';

export type AppNavigatorParamList = {
  APP_01_HOME: undefined;
  APP_02_SETTINGS: NavigatorScreenParams<SettingsNavigatorParamList>;
};

export type AuthNavigatorParamList = {
  AUTH_01_WELCOME: undefined;
  AUTH_02_LOGIN: undefined;
  AUTH_03_REGISTER: undefined;
  AUTH_04_SET_PROFILE: { email: string; password: string };
  AUTH_05_FORGOT: undefined;
};

export type HomeNavigatorParamList = {
  HOME_01_LIBRARY: undefined;
  HOME_02_DISCOVER: undefined;
  HOME_03_ORDER: undefined;
};

export type LibraryNavigatorParamList = {
  LIBRARY_01_LIBRARY: undefined;
  LIBRARY_02_BOOK: {
    book: BookResult;
  };
  LIBRARY_03_SEARCH: undefined;
};

export type OrderNavigatorParamList = {
  ORDER_01_ORDER: undefined;
  ORDER_02_ORDER_SHOP: {
    books: (UserBook & BookResult)[];
  };
  ORDER_03_ADDRESS_SCREEN: undefined;
  ORDER_04_BOOKSHOP: {
    shop: Shop;
  };
  ORDER_05_EMAIL_SCREEN: undefined;
  ORDER_06_ORDER_PLACED: {
    bookshopName?: string;
  };
};

export type DiscoverNavigatorParamList = {
  DISCOVER_01_DISCOVER: undefined;
  DISCOVER_02_ADDRESS: undefined;
  DISCOVER_03_BOOKSHOP: {
    shop: Shop;
  };
};

export type SettingsNavigatorParamList = {
  SETTINGS_01_SETTINGS: undefined;
  SETTINGS_02_CHANGE_ADDRESS: undefined;
  SETTINGS_03_RESET_PASSWORD: undefined;
  SETTINGS_04_DELETE_ACCOUNT: undefined;
};

export type NavigationType = HomeNavigatorParamList &
  LibraryNavigatorParamList &
  OrderNavigatorParamList &
  DiscoverNavigatorParamList &
  AuthNavigatorParamList &
  AppNavigatorParamList &
  SettingsNavigatorParamList;
