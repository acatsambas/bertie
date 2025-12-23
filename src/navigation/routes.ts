import type {
  AppNavigatorParamList,
  AuthNavigatorParamList,
  DiscoverNavigatorParamList,
  HomeNavigatorParamList,
  LibraryNavigatorParamList,
  OrderNavigatorParamList,
  RootNavigatorParamList,
  SettingsNavigatorParamList,
} from './types';

export const APP_ROUTES: {
  [key in keyof AppNavigatorParamList]: key;
} = {
  APP_01_HOME: 'APP_01_HOME',
  APP_02_SETTINGS: 'APP_02_SETTINGS',
};

export const HOME_ROUTES: {
  [key in keyof HomeNavigatorParamList]: key;
} = {
  HOME_01_LIBRARY: 'HOME_01_LIBRARY',
  HOME_02_DISCOVER: 'HOME_02_DISCOVER',
  HOME_03_ORDER: 'HOME_03_ORDER',
};

export const LIBRARY_ROUTES: {
  [key in keyof LibraryNavigatorParamList]: key;
} = {
  LIBRARY_01_LIBRARY: 'LIBRARY_01_LIBRARY',
  LIBRARY_02_BOOK: 'LIBRARY_02_BOOK',
  LIBRARY_03_SEARCH: 'LIBRARY_03_SEARCH',
};

export const ORDER_ROUTES: {
  [key in keyof OrderNavigatorParamList]: key;
} = {
  ORDER_01_ORDER: 'ORDER_01_ORDER',
  ORDER_02_ORDER_SHOP: 'ORDER_02_ORDER_SHOP',
  ORDER_03_ADDRESS_SCREEN: 'ORDER_03_ADDRESS_SCREEN',
  ORDER_04_BOOKSHOP: 'ORDER_04_BOOKSHOP',
  ORDER_05_EMAIL_SCREEN: 'ORDER_05_EMAIL_SCREEN',
  ORDER_06_ORDER_PLACED: 'ORDER_06_ORDER_PLACED',
};

export const DISCOVER_ROUTES: {
  [key in keyof DiscoverNavigatorParamList]: key;
} = {
  DISCOVER_01_DISCOVER: 'DISCOVER_01_DISCOVER',
  DISCOVER_02_ADDRESS: 'DISCOVER_02_ADDRESS',
  DISCOVER_03_BOOKSHOP: 'DISCOVER_03_BOOKSHOP',
};

export const AUTH_ROUTES: { [key in keyof AuthNavigatorParamList]: key } = {
  AUTH_01_WELCOME: 'AUTH_01_WELCOME',
  AUTH_02_LOGIN: 'AUTH_02_LOGIN',
  AUTH_03_REGISTER: 'AUTH_03_REGISTER',
  AUTH_04_SET_PROFILE: 'AUTH_04_SET_PROFILE',
  AUTH_05_FORGOT: 'AUTH_05_FORGOT',
};

export const SETTINGS_ROUTES: {
  [key in keyof SettingsNavigatorParamList]: key;
} = {
  SETTINGS_01_SETTINGS: 'SETTINGS_01_SETTINGS',
  SETTINGS_02_CHANGE_ADDRESS: 'SETTINGS_02_CHANGE_ADDRESS',
  SETTINGS_03_RESET_PASSWORD: 'SETTINGS_03_RESET_PASSWORD',
  SETTINGS_04_DELETE_ACCOUNT: 'SETTINGS_04_DELETE_ACCOUNT',
};

export const ROOT_ROUTES: {
  [key in keyof RootNavigatorParamList]: key;
} = {
  ROOT_01_AUTH: 'ROOT_01_AUTH',
  ROOT_02_APP: 'ROOT_02_APP',
  ROOT_03_DATA_REQUEST: 'ROOT_03_DATA_REQUEST',
  ROOT_04_SUPPORT: 'ROOT_04_SUPPORT',
  ROOT_05_PRIVACY_POLICY: 'ROOT_05_PRIVACY_POLICY',
};

export const Routes = {
  ...AUTH_ROUTES,
  ...SETTINGS_ROUTES,
  ...DISCOVER_ROUTES,
  ...ORDER_ROUTES,
  ...LIBRARY_ROUTES,
  ...APP_ROUTES,
  ...HOME_ROUTES,
  ...ROOT_ROUTES,
};
