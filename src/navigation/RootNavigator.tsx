import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePWA } from 'contexts/PWAContext';
import { useContext, useEffect, useRef } from 'react';

import { AuthContext } from 'api/auth/AuthProvider';

import BookScreen from 'screens/BookScreen';
import DataRequestScreen from 'screens/DataRequestScreen';
import PrivacyPolicyScreen from 'screens/PrivacyPolicyScreen';
import SupportScreen from 'screens/SupportScreen';

import StyledNavigationContainer from 'styles/StyledNavigationContainer';

import AppNavigator from './navigators/AppNavigator';
import AuthNavigator from './navigators/AuthNavigator';
import { ROOT_ROUTES } from './routes';
import type { RootNavigatorParamList } from './types';

const RootStack = createNativeStackNavigator<RootNavigatorParamList>();

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
        {/* Public routes — always accessible regardless of auth state */}
        <RootStack.Screen
          name={ROOT_ROUTES.ROOT_06_BOOK}
          component={BookScreen}
          options={{ title: 'Book' }}
        />
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
