export type SettingsNavigatorParamList = {
  Settings: undefined;
  ChangeAddress: undefined;
};

export type LibraryNavigatorParamList = {
  Library: undefined;
  Book: { bookName: string };
  Search: undefined;
};

export type DiscoverNavigatorParamList = {
  Discover: undefined;
  Bookshop: { bookshopName: string };
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
