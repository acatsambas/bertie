import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

import { AuthContext } from 'api/auth/AuthProvider';

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
  const { user } = useContext(AuthContext);

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
