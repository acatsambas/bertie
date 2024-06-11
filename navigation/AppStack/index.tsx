import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { SettingsNavigatorParamList } from "./params";

import { translations } from "../../locales/translations";
import SettingsScreen from "../../screens/SettingsScreen";
import AddressScreen from "../../screens/AddressScreen";

export const SettingsStack =
  createNativeStackNavigator<SettingsNavigatorParamList>();

const SettingsNavigator = () => {
  const { t } = useTranslation();
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t(translations.settings.title) }}
      />
      <SettingsStack.Screen
        name="ChangeAddress"
        component={AddressScreen}
        options={{ title: t(translations.settings.address.title) }}
      />
    </SettingsStack.Navigator>
  );
};

// for testing purposes
const AppNagivator = () => {
  return <SettingsNavigator />;
};

export default AppNagivator;
