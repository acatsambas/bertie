import {
  CommonActions,
  type NavigationProp,
  type NavigatorScreenParams,
  type ParamListBase,
} from '@react-navigation/native';

import { navigationRef } from './navigationRef';
import { Routes } from './routes';
import type { AppNavigatorParamList } from './types';

type FallbackTarget = NavigatorScreenParams<AppNavigatorParamList>;

const HOME_LIBRARY = {
  screen: Routes.APP_01_HOME,
  params: {
    screen: Routes.HOME_01_LIBRARY,
    params: { screen: Routes.LIBRARY_01_LIBRARY },
  },
} as const satisfies FallbackTarget;

const SETTINGS_HOME = {
  screen: Routes.APP_02_SETTINGS,
  params: { screen: Routes.SETTINGS_01_SETTINGS },
} as const satisfies FallbackTarget;

const LIBRARY_HOME = {
  screen: Routes.APP_01_HOME,
  params: {
    screen: Routes.HOME_01_LIBRARY,
    params: { screen: Routes.LIBRARY_01_LIBRARY },
  },
} as const satisfies FallbackTarget;

const ORDER_HOME = {
  screen: Routes.APP_01_HOME,
  params: {
    screen: Routes.HOME_03_ORDER,
    params: { screen: Routes.ORDER_01_ORDER },
  },
} as const satisfies FallbackTarget;

const DISCOVER_HOME = {
  screen: Routes.APP_01_HOME,
  params: {
    screen: Routes.HOME_02_DISCOVER,
    params: { screen: Routes.DISCOVER_01_DISCOVER },
  },
} as const satisfies FallbackTarget;

/** Predictable parent when stack history is empty (refresh / deep link). */
const PARENT_FALLBACKS: Partial<Record<string, FallbackTarget>> = {
  [Routes.SETTINGS_01_SETTINGS]: HOME_LIBRARY,
  [Routes.SETTINGS_02_CHANGE_ADDRESS]: SETTINGS_HOME,
  [Routes.SETTINGS_03_RESET_PASSWORD]: SETTINGS_HOME,
  [Routes.SETTINGS_04_DELETE_ACCOUNT]: SETTINGS_HOME,
  [Routes.SETTINGS_05_IMPORT_GOODREADS]: SETTINGS_HOME,
  [Routes.LIBRARY_03_SEARCH]: LIBRARY_HOME,
  [Routes.ORDER_00_ADD_BOOKS]: ORDER_HOME,
  [Routes.ORDER_02_ORDER_SHOP]: ORDER_HOME,
  [Routes.ORDER_03_ADDRESS_SCREEN]: ORDER_HOME,
  [Routes.ORDER_04_BOOKSHOP]: ORDER_HOME,
  [Routes.ORDER_05_EMAIL_SCREEN]: ORDER_HOME,
  [Routes.ORDER_06_ORDER_PLACED]: ORDER_HOME,
  [Routes.DISCOVER_02_ADDRESS]: DISCOVER_HOME,
  [Routes.DISCOVER_03_BOOKSHOP]: DISCOVER_HOME,
  [Routes.ROOT_06_BOOK]: HOME_LIBRARY,
};

const navigateToFallback = (target: FallbackTarget) => {
  if (!navigationRef.isReady()) {
    return;
  }
  navigationRef.dispatch(CommonActions.navigate(Routes.ROOT_02_APP, target));
};

/**
 * Prefer stack history; otherwise navigate to a known parent for the route,
 * or home/library as the ultimate fallback. Avoids the GO_BACK warning when
 * the user refreshed or landed via deep link with an empty stack.
 */
export const goBackOrFallback = (
  navigation: Pick<NavigationProp<ParamListBase>, 'canGoBack' | 'goBack'>,
  routeName?: string,
) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  const parent = routeName ? PARENT_FALLBACKS[routeName] : undefined;
  navigateToFallback(parent ?? HOME_LIBRARY);
};
