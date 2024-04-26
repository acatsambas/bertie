import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthNavigatorParamList } from "./params";

import WelcomeScreen from "../../screens/WelcomeScreen";
import LoginScreen from "../../screens/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen";
import ForgotScreen from "../../screens/ForgotScreen";

export const Stack = createNativeStackNavigator<AuthNavigatorParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitle: "",
        headerStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ title: "Welcome", headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Register", headerShown: false }}
      />
      <Stack.Screen
        name="Forgot"
        component={ForgotScreen}
        options={{ title: "Forgot", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
