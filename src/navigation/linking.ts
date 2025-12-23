import type { LinkingOptions } from '@react-navigation/native';
import { Platform } from 'react-native';

import {
  APP_ROUTES,
  AUTH_ROUTES,
  DISCOVER_ROUTES,
  HOME_ROUTES,
  LIBRARY_ROUTES,
  ORDER_ROUTES,
  ROOT_ROUTES,
  SETTINGS_ROUTES,
} from './routes';
import type { RootNavigatorParamList } from './types';

const toLinkingScreens = <T extends Record<string, string>>(
  routes: T,
): Record<string, string> => {
  return Object.values(routes).reduce(
    (acc, value) => {
      acc[value] = value;
      return acc;
    },
    {} as Record<string, string>,
  );
};

export const linking: LinkingOptions<RootNavigatorParamList> = {
  prefixes: [],
  config: {
    screens: {
      [ROOT_ROUTES.ROOT_01_AUTH]: {
        screens: toLinkingScreens(AUTH_ROUTES),
      },
      [ROOT_ROUTES.ROOT_02_APP]: {
        screens: {
          [APP_ROUTES.APP_01_HOME]: {
            screens: {
              [HOME_ROUTES.HOME_01_LIBRARY]: {
                screens: toLinkingScreens(LIBRARY_ROUTES),
              },
              [HOME_ROUTES.HOME_02_DISCOVER]: {
                screens: toLinkingScreens(DISCOVER_ROUTES),
              },
              [HOME_ROUTES.HOME_03_ORDER]: {
                screens: toLinkingScreens(ORDER_ROUTES),
              },
            },
          },
          [APP_ROUTES.APP_02_SETTINGS]: {
            screens: toLinkingScreens(SETTINGS_ROUTES),
          },
        },
      },
      [ROOT_ROUTES.ROOT_03_DATA_REQUEST]: ROOT_ROUTES.ROOT_03_DATA_REQUEST,
      [ROOT_ROUTES.ROOT_04_SUPPORT]: ROOT_ROUTES.ROOT_04_SUPPORT,
      [ROOT_ROUTES.ROOT_05_PRIVACY_POLICY]: ROOT_ROUTES.ROOT_05_PRIVACY_POLICY,
    },
  },
  enabled: Platform.OS === 'web',
};
