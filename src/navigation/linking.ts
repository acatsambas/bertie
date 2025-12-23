import { Platform } from 'react-native';

import { ROOT_ROUTES } from './routes';

// Public routes configuration - add new public routes here
// Format: { path: routeName }
const PUBLIC_ROUTES = {
  data_request: ROOT_ROUTES.ROOT_03_DATA_REQUEST,
  support: ROOT_ROUTES.ROOT_04_SUPPORT,
  privacypolicy: ROOT_ROUTES.ROOT_05_PRIVACY_POLICY,
} as const;

const getStateFromPath = (path: string) => {
  let normalizedPath = path.replace(/^\/+|\/+$/g, '') || '';
  normalizedPath = normalizedPath.replace(/\.html$/, '');

  if (
    normalizedPath &&
    PUBLIC_ROUTES[normalizedPath as keyof typeof PUBLIC_ROUTES]
  ) {
    const routeName =
      PUBLIC_ROUTES[normalizedPath as keyof typeof PUBLIC_ROUTES];
    return {
      routes: [
        {
          name: routeName,
        },
      ],
    };
  }

  return undefined;
};

export const linking = {
  prefixes: [],
  config: {
    screens: {},
  },
  getStateFromPath,
  enabled: Platform.OS === 'web',
};
