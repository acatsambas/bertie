import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import {
  AppNavigatorParamList,
  LibraryNavigatorParamList,
  SettingsNavigatorParamList,
} from "./params";

import { translations } from "../../locales/translations";
import SettingsScreen from "../../screens/SettingsScreen";
import AddressScreen from "../../screens/AddressScreen";
import DiscoverScreen from "../../screens/DiscoverScreen";
import LibraryScreen from "../../screens/LibraryScreen";
import OrderScreen from "../../screens/OrderScreen";
import BookScreen from "../../screens/BookScreen";

export const AppStack = createNativeStackNavigator<AppNavigatorParamList>();

export const SettingsStack =
  createNativeStackNavigator<SettingsNavigatorParamList>();

export const LibraryStack =
  createNativeStackNavigator<LibraryNavigatorParamList>();

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

const LibraryNavigator = () => {
  const { t } = useTranslation();
  return (
    <LibraryStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <LibraryStack.Screen
        name="Library"
        component={LibraryScreen}
        options={{ title: t(translations.library.title), animation: "none" }}
      />
      <LibraryStack.Screen
        name="Book"
        component={BookScreen}
        options={{ title: t(translations.library.book), animation: "none" }}
      />
    </LibraryStack.Navigator>
  );
};

const AppNagivator = () => {
  const { t } = useTranslation();
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen
        name="Library"
        component={LibraryNavigator}
        options={{
          title: t(translations.library.title),
          animation: "none",
        }}
      />
      <AppStack.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: t(translations.discover.title),
          animation: "none",
        }}
      />
      <AppStack.Screen
        name="Order"
        component={OrderScreen}
        options={{
          title: t(translations.order.title),
          animation: "none",
        }}
      />
      <AppStack.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: t(translations.settings.title),
          animation: "none",
        }}
      />
    </AppStack.Navigator>
  );
};

export default AppNagivator;
