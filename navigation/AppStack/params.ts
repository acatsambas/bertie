import { Shop, UserBook } from '../../api/app/types';
import { BookResult } from '../../api/google-books/search';

export type SettingsNavigatorParamList = {
  Settings: undefined;
  ChangeAddress: undefined;
  ResetPassword: undefined;
  DeleteAccount: undefined;
};

export type LibraryNavigatorParamList = {
  Library: undefined;
  Book: {
    book: BookResult;
  };
  Search: undefined;
};

export type DiscoverNavigatorParamList = {
  Discover: undefined;
  Bookshop: {
    shop: Shop;
  };
};

export type OrderPlacedProps = {
  bookshopName?: string;
};

export type OrderShopProps = {
  books: (UserBook & BookResult)[];
};

export type OrderNavigatorParamList = {
  Order: undefined;
  OrderShop: OrderShopProps;
  AddressScreen: undefined;
  Bookshop: {
    shop: Shop;
  };
  OrderPlaced: OrderPlacedProps;
};

export type AppNavigatorParamList = {
  DiscoverNavigator: undefined;
  LibraryNavigator: undefined;
  OrderNavigator: undefined;
  SettingsNavigator: undefined;
};
