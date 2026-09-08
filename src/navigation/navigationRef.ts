import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootNavigatorParamList } from './types';

export const navigationRef =
  createNavigationContainerRef<RootNavigatorParamList>();
