export type SettingsNavigatorParamList = {
  Settings: undefined;
  ChangeAddress: undefined;
  ResetPassword: undefined;
  DeleteAccount: undefined;
};

export type LibraryNavigatorParamList = {
  Library: undefined;
  Book: { bookName?: string; author?: string; isMyList?: boolean; id?: string };
  Search: undefined;
};

export type BookshopType = {
  address: string;
  city: string;
  country: string;
  name: string;
  zipcode: string;
  description: string;
};

export type DiscoverNavigatorParamList = {
  Discover: undefined;
  Bookshop: BookshopType;
};

export type OrderNavigatorParamList = {
  Order: undefined;
  OrderShop: undefined;
  OrderPlaced: undefined;
};

export type AppNavigatorParamList = {
  DiscoverNavigator: undefined;
  LibraryNavigator: undefined;
  OrderNavigator: undefined;
  SettingsNavigator: undefined;
};
