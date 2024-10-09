import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import {
  AppNavigatorParamList,
  DiscoverNavigatorParamList,
  LibraryNavigatorParamList,
  SettingsNavigatorParamList,
  OrderNavigatorParamList,
} from "./params";

import { translations } from "../../locales/translations";
import SettingsScreen from "../../screens/SettingsScreen";
import AddressScreen from "../../screens/AddressScreen";
import DiscoverScreen from "../../screens/DiscoverScreen";
import LibraryScreen from "../../screens/LibraryScreen";
import OrderScreen from "../../screens/OrderScreen";
import BookScreen from "../../screens/BookScreen";
import BookshopScreen from "../../screens/BookshopScreen";
import SearchBookScreen from "../../screens/SearchBookScreen";
import OrderShopScreen from "../../screens/OrderShopScreen";
import OrderPlacedScreen from "../../screens/OrderPlacedScreen";
import DeleteScreen from "../../screens/DeleteScreen";
import ResetScreen from "../../screens/ResetScreen";

export const AppStack = createNativeStackNavigator<AppNavigatorParamList>();

export const SettingsStack =
  createNativeStackNavigator<SettingsNavigatorParamList>();

export const LibraryStack =
  createNativeStackNavigator<LibraryNavigatorParamList>();

export const DiscoverStack =
  createNativeStackNavigator<DiscoverNavigatorParamList>();

export const OrderStack = createNativeStackNavigator<OrderNavigatorParamList>();

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
        options={{}}
      />
      <SettingsStack.Screen
        name="ChangeAddress"
        component={AddressScreen}
        options={{}}
      />
      <SettingsStack.Screen
        name="ResetPassword"
        component={ResetScreen}
        options={{}}
      />
      <SettingsStack.Screen
        name="DeleteAccount"
        component={DeleteScreen}
        options={{}}
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
        options={{ animation: "none" }}
      />
      <LibraryStack.Screen
        name="Book"
        component={BookScreen}
        options={{ animation: "none" }}
      />
      <LibraryStack.Screen
        name="Search"
        component={SearchBookScreen}
        options={{
          animation: "none",
        }}
      />
    </LibraryStack.Navigator>
  );
};

const DiscoverNavigator = () => {
  const { t } = useTranslation();
  return (
    <DiscoverStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <DiscoverStack.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{ animation: "none" }}
      />
      <DiscoverStack.Screen
        name="Bookshop"
        component={BookshopScreen}
        options={{
          animation: "none",
        }}
      />
    </DiscoverStack.Navigator>
  );
};

const OrderNavigator = () => {
  const { t } = useTranslation();
  return (
    <OrderStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OrderStack.Screen
        name="Order"
        component={OrderScreen}
        options={{ animation: "none" }}
      />
      <OrderStack.Screen
        name="OrderShop"
        component={OrderShopScreen}
        options={{
          animation: "none",
        }}
      />
      <OrderStack.Screen
        name="OrderPlaced"
        component={OrderPlacedScreen}
        options={{
          animation: "none",
        }}
      />
      <OrderStack.Screen
        name="AddressScreen"
        component={AddressScreen}
        options={{
          animation: "none",
        }}
      />
      <OrderStack.Screen
        name="Bookshop"
        component={BookshopScreen}
        options={{
          animation: "none",
        }}
      />
    </OrderStack.Navigator>
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
        name="LibraryNavigator"
        component={LibraryNavigator}
        options={{
          title: t(translations.library.title),
          animation: "none",
        }}
      />
      <AppStack.Screen
        name="DiscoverNavigator"
        component={DiscoverNavigator}
        options={{
          title: t(translations.discover.title),
          animation: "none",
        }}
      />
      <AppStack.Screen
        name="OrderNavigator"
        component={OrderNavigator}
        options={{
          title: t(translations.order.title),
          animation: "none",
        }}
      />
      <AppStack.Screen
        name="SettingsNavigator"
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
