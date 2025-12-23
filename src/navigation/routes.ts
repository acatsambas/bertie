export const APP_ROUTES = {
  APP_01_HOME: 'home',
  APP_02_SETTINGS: 'settings',
} as const;

export const HOME_ROUTES = {
  HOME_01_LIBRARY: 'library',
  HOME_02_DISCOVER: 'discover',
  HOME_03_ORDER: 'order',
} as const;

export const LIBRARY_ROUTES = {
  LIBRARY_01_LIBRARY: 'library',
  LIBRARY_02_BOOK: 'book',
  LIBRARY_03_SEARCH: 'search',
} as const;

export const ORDER_ROUTES = {
  ORDER_01_ORDER: 'order',
  ORDER_02_ORDER_SHOP: 'shop',
  ORDER_03_ADDRESS_SCREEN: 'order-address',
  ORDER_04_BOOKSHOP: 'order-bookshop',
  ORDER_05_EMAIL_SCREEN: 'email',
  ORDER_06_ORDER_PLACED: 'placed',
} as const;

export const DISCOVER_ROUTES = {
  DISCOVER_01_DISCOVER: 'discover',
  DISCOVER_02_ADDRESS: 'discover-address',
  DISCOVER_03_BOOKSHOP: 'discover-bookshop',
} as const;

export const AUTH_ROUTES = {
  AUTH_01_WELCOME: 'welcome',
  AUTH_02_LOGIN: 'login',
  AUTH_03_REGISTER: 'register',
  AUTH_04_SET_PROFILE: 'set-profile',
  AUTH_05_FORGOT: 'forgot',
} as const;

export const SETTINGS_ROUTES = {
  SETTINGS_01_SETTINGS: 'settings',
  SETTINGS_02_CHANGE_ADDRESS: 'change-address',
  SETTINGS_03_RESET_PASSWORD: 'reset-password',
  SETTINGS_04_DELETE_ACCOUNT: 'delete-account',
} as const;

export const ROOT_ROUTES = {
  ROOT_01_AUTH: 'auth',
  ROOT_02_APP: 'app',
  ROOT_03_DATA_REQUEST: 'data_request',
  ROOT_04_SUPPORT: 'support',
  ROOT_05_PRIVACY_POLICY: 'privacypolicy',
} as const;

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
