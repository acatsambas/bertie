import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsDesktop } from 'hooks/useIsDesktop';
import React from 'react';

import DesktopColumn from 'components/DesktopColumn';

import { DiscoverNavigator } from 'navigation/navigators/DiscoverNavigator';
import { LibraryNavigator } from 'navigation/navigators/LibraryNavigator';
import { OrderNavigator } from 'navigation/navigators/OrderNavigator';
import { HOME_ROUTES } from 'navigation/routes';
import type { HomeNavigatorParamList } from 'navigation/types';

import BottomMenu from './components/BottomMenu';
import SideRail from './components/SideRail';

export const HomeBottomTab = createBottomTabNavigator<HomeNavigatorParamList>();

export const HomeNavigator = () => {
  const isDesktop = useIsDesktop();

  // Everything desktop-specific hangs off this one flag; off it, the
  // navigator gets exactly the props it always had.
  return (
    <HomeBottomTab.Navigator
      id={undefined}
      screenOptions={
        isDesktop
          ? { headerShown: false, tabBarPosition: 'left' }
          : { headerShown: false }
      }
      tabBar={
        isDesktop
          ? ({ state }) => (
              <SideRail activeScreen={state.routes[state.index].name} />
            )
          : () => <BottomMenu />
      }
      screenLayout={
        isDesktop
          ? ({ children }) => <DesktopColumn>{children}</DesktopColumn>
          : undefined
      }
    >
      <HomeBottomTab.Screen
        name={HOME_ROUTES.HOME_01_LIBRARY}
        component={LibraryNavigator}
      />
      <HomeBottomTab.Screen
        name={HOME_ROUTES.HOME_02_DISCOVER}
        component={DiscoverNavigator}
      />
      <HomeBottomTab.Screen
        name={HOME_ROUTES.HOME_03_ORDER}
        component={OrderNavigator}
      />
    </HomeBottomTab.Navigator>
  );
};
