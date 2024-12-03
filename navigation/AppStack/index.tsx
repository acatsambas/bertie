import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import React from 'react';

import { translations } from '../../locales/translations';
import AddressScreen from '../../screens/AddressScreen';
import BookScreen from '../../screens/BookScreen';
import BookshopScreen from '../../screens/BookshopScreen';
import DeleteScreen from '../../screens/DeleteScreen';
import DiscoverScreen from '../../screens/DiscoverScreen';
import LibraryScreen from '../../screens/LibraryScreen';
import OrderPlacedScreen from '../../screens/OrderPlacedScreen';
import OrderScreen from '../../screens/OrderScreen';
import OrderShopScreen from '../../screens/OrderShopScreen';
import ResetScreen from '../../screens/ResetScreen';
import SearchBookScreen from '../../screens/SearchBookScreen';
import SettingsScreen from '../../screens/SettingsScreen';

import {
  AppNavigatorParamList,
  DiscoverNavigatorParamList,
  LibraryNavigatorParamList,
  OrderNavigatorParamList,
  SettingsNavigatorParamList,
} from './params';

const createStack = (
  Stack: ReturnType<typeof createNativeStackNavigator>,
  screens: { name: string; component: React.ComponentType<any> }[],
) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      {screens.map(({ name, component }, index) => (
        <Stack.Screen key={index} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
};

export const AppStack = createNativeStackNavigator<AppNavigatorParamList>();
export const SettingsStack =
  createNativeStackNavigator<SettingsNavigatorParamList>();
export const LibraryStack =
  createNativeStackNavigator<LibraryNavigatorParamList>();
export const DiscoverStack =
  createNativeStackNavigator<DiscoverNavigatorParamList>();
export const OrderStack = createNativeStackNavigator<OrderNavigatorParamList>();

const SettingsNavigator = () =>
  createStack(SettingsStack, [
    { name: 'Settings', component: SettingsScreen },
    { name: 'ChangeAddress', component: AddressScreen },
    { name: 'ResetPassword', component: ResetScreen },
    { name: 'DeleteAccount', component: DeleteScreen },
  ]);

const LibraryNavigator = () =>
  createStack(LibraryStack, [
    { name: 'Library', component: LibraryScreen },
    { name: 'Book', component: BookScreen },
    { name: 'Search', component: SearchBookScreen },
  ]);

const DiscoverNavigator = () =>
  createStack(DiscoverStack, [
    { name: 'Discover', component: DiscoverScreen },
    { name: 'Bookshop', component: BookshopScreen },
    { name: 'AddressScreen', component: AddressScreen },
  ]);

const OrderNavigator = () =>
  createStack(OrderStack, [
    { name: 'Order', component: OrderScreen },
    { name: 'OrderShop', component: OrderShopScreen },
    { name: 'OrderPlaced', component: OrderPlacedScreen },
    { name: 'AddressScreen', component: AddressScreen },
    { name: 'Bookshop', component: BookshopScreen },
  ]);

const AppNavigator = () => {
  const { t } = useTranslation();

  return (
    <AppStack.Navigator
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      <AppStack.Screen
        name="LibraryNavigator"
        component={LibraryNavigator}
        options={{ title: t(translations.library.title) }}
      />
      <AppStack.Screen
        name="DiscoverNavigator"
        component={DiscoverNavigator}
        options={{ title: t(translations.discover.title) }}
      />
      <AppStack.Screen
        name="OrderNavigator"
        component={OrderNavigator}
        options={{ title: t(translations.order.title) }}
      />
      <AppStack.Screen
        name="SettingsNavigator"
        component={SettingsNavigator}
        options={{ title: t(translations.settings.title) }}
      />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
