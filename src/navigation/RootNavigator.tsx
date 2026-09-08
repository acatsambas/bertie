import { CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePWA } from 'contexts/PWAContext';
import { useContext, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { AuthContext } from 'api/auth/AuthProvider';

import DataRequestScreen from 'screens/DataRequestScreen';
import PrivacyPolicyScreen from 'screens/PrivacyPolicyScreen';
import SupportScreen from 'screens/SupportScreen';

import StyledNavigationContainer from 'styles/StyledNavigationContainer';

import AppNavigator from './navigators/AppNavigator';
import AuthNavigator from './navigators/AuthNavigator';
import { navigationRef } from './navigationRef';
import {
  APP_ROUTES,
  HOME_ROUTES,
  LIBRARY_ROUTES,
  ROOT_ROUTES,
} from './routes';
import type { RootNavigatorParamList } from './types';

const RootStack = createNativeStackNavigator<RootNavigatorParamList>();

// Capture the book deep link URL at module load time, before React Navigation
// overwrites window.location.pathname when it can't match an auth screen.
let pendingBookId: string | null = null;
if (Platform.OS === 'web') {
  const match = window.location.pathname.match(/^\/book\/(.+)$/);
  if (match) {
    pendingBookId = match[1];
  }
}

const RootNavigator = () => {
  const { user, authLoading } = useContext(AuthContext);
  const { showInstallPrompt } = usePWA();
  const previousUserRef = useRef(user);

  // Trigger PWA prompt when user becomes authenticated (manual or auto-login)
  useEffect(() => {
    const wasLoggedOut = !previousUserRef.current;
    const isNowLoggedIn = !!user;

    if (wasLoggedOut && isNowLoggedIn) {
      // Small delay to let the app settle after login
      setTimeout(() => {
        showInstallPrompt();
      }, 500);

      // Handle pending book deep link on web
      if (pendingBookId) {
        const bookId = pendingBookId;
        pendingBookId = null; // Clear so it doesn't re-trigger on re-login
        // Delay to let the app navigator mount before navigating
        setTimeout(() => {
          if (navigationRef.isReady()) {
            navigationRef.dispatch(
              CommonActions.navigate({
                name: ROOT_ROUTES.ROOT_02_APP,
                params: {
                  screen: APP_ROUTES.APP_01_HOME,
                  params: {
                    screen: HOME_ROUTES.HOME_01_LIBRARY,
                    params: {
                      screen: LIBRARY_ROUTES.LIBRARY_02_BOOK,
                      params: { bookId },
                    },
                  },
                },
              }),
            );
          }
        }, 600);
      }
    }

    previousUserRef.current = user;
  }, [user, showInstallPrompt]);

  if (authLoading) {
    return null;
  }

  return (
    <StyledNavigationContainer>
      <RootStack.Navigator
        id={undefined}
        initialRouteName={
          user ? ROOT_ROUTES.ROOT_02_APP : ROOT_ROUTES.ROOT_01_AUTH
        }
        screenOptions={{ headerShown: false, animation: 'none' }}
      >
        {user ? (
          <RootStack.Screen
            name={ROOT_ROUTES.ROOT_02_APP}
            component={AppNavigator}
            options={{ title: 'App' }}
          />
        ) : (
          <RootStack.Screen
            name={ROOT_ROUTES.ROOT_01_AUTH}
            component={AuthNavigator}
            options={{ title: 'Auth' }}
          />
        )}
        {/* Public routes defined last so they don't interfere with default routing */}
        <RootStack.Screen
          name={ROOT_ROUTES.ROOT_03_DATA_REQUEST}
          component={DataRequestScreen}
          options={{ title: 'Data Request' }}
        />
        <RootStack.Screen
          name={ROOT_ROUTES.ROOT_04_SUPPORT}
          component={SupportScreen}
          options={{ title: 'Support' }}
        />
        <RootStack.Screen
          name={ROOT_ROUTES.ROOT_05_PRIVACY_POLICY}
          component={PrivacyPolicyScreen}
          options={{ title: 'Privacy Policy' }}
        />
      </RootStack.Navigator>
    </StyledNavigationContainer>
  );
};

export default RootNavigator;
