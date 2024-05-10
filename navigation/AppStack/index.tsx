import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsNavigatorParamList } from "./params";

import SettingsScreen from "../../screens/SettingsScreen";

export const SettingsStack =
  createNativeStackNavigator<SettingsNavigatorParamList>();

const SettingsNavigator = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </SettingsStack.Navigator>
  );
};
