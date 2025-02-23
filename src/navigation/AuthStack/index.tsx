import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ForgotScreen from 'screens/ForgotScreen';
import LoginScreen from 'screens/LoginScreen';
import RegisterScreen from 'screens/RegisterScreen';
import SetProfileScreen from 'screens/SetProfileScreen';
import WelcomeScreen from 'screens/WelcomeScreen';

import { AuthNavigatorParamList } from './params';

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
        name="Welcome"
        component={WelcomeScreen}
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Register' }}
      />
      <Stack.Screen
        name="SetProfile"
        component={SetProfileScreen}
        options={{ title: 'SetProfile' }}
      />
      <Stack.Screen
        name="Forgot"
        component={ForgotScreen}
        options={{ title: 'Forgot' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
