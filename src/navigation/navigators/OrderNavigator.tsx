import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ORDER_ROUTES } from 'navigation/routes';
import type { OrderNavigatorParamList } from 'navigation/types';

import AddressScreen from 'screens/AddressScreen';
import BookshopScreen from 'screens/BookshopScreen';
import EmailScreen from 'screens/EmailScreen';
import OrderPlacedScreen from 'screens/OrderPlacedScreen';
import OrderScreen from 'screens/OrderScreen';
import OrderShopScreen from 'screens/OrderShopScreen';

export const OrderStack = createNativeStackNavigator<OrderNavigatorParamList>();

export const OrderNavigator = () => (
  <OrderStack.Navigator
    screenOptions={{ headerShown: false, animation: 'none' }}
  >
    <OrderStack.Screen
      name={ORDER_ROUTES.ORDER_01_ORDER}
      component={OrderScreen}
    />
    <OrderStack.Screen
      name={ORDER_ROUTES.ORDER_02_ORDER_SHOP}
      component={OrderShopScreen}
    />
    <OrderStack.Screen
      name={ORDER_ROUTES.ORDER_03_ADDRESS_SCREEN}
      component={OrderPlacedScreen}
    />
    <OrderStack.Screen
      name={ORDER_ROUTES.ORDER_04_BOOKSHOP}
      component={AddressScreen}
    />
    <OrderStack.Screen
      name={ORDER_ROUTES.ORDER_05_EMAIL_SCREEN}
      component={BookshopScreen}
    />
    <OrderStack.Screen
      name={ORDER_ROUTES.ORDER_06_ORDER_PLACED}
      component={EmailScreen}
    />
  </OrderStack.Navigator>
);
