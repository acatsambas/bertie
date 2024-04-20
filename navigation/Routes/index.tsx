import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "../AuthStack";

import { AuthNavigatorParamList } from "../AuthStack/params";

import WelcomeScreen from "../../screens/WelcomeScreen";
import LoginScreen from "../../screens/LoginScreen";

const Stack = createNativeStackNavigator<AuthNavigatorParamList>();

const Routes = () => {
  return (
    <NavigationContainer>
      {/* <AuthNavigator /> */}
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
