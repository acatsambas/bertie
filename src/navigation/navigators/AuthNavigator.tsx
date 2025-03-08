import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AUTH_ROUTES } from 'navigation/routes';
import type { AuthNavigatorParamList } from 'navigation/types';

import ForgotScreen from 'screens/ForgotScreen';
import LoginScreen from 'screens/LoginScreen';
import RegisterScreen from 'screens/RegisterScreen';
import SetProfileScreen from 'screens/SetProfileScreen';
import WelcomeScreen from 'screens/WelcomeScreen';

export const Stack = createNativeStackNavigator<AuthNavigatorParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitle: '',
        headerStyle: { backgroundColor: 'transparent' },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={AUTH_ROUTES.AUTH_01_WELCOME}
        component={WelcomeScreen}
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.AUTH_02_LOGIN}
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.AUTH_03_REGISTER}
        component={RegisterScreen}
        options={{ title: 'Register' }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.AUTH_04_SET_PROFILE}
        component={SetProfileScreen}
        options={{ title: 'SetProfile' }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.AUTH_05_FORGOT}
        component={ForgotScreen}
        options={{ title: 'Forgot' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
