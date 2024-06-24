export type SettingsNavigatorParamList = {
  Settings: undefined;
  ChangeAddress: undefined;
};

export type LibraryNavigatorParamList = {
  Library: undefined;
  Book: { bookName: string };
};

export type DiscoverNavigatorParamList = {
  Discover: undefined;
  Bookshop: { bookshopName: string };
};

export type AppNavigatorParamList = {
  DiscoverNavigator: undefined;
  LibraryNavigator: undefined;
  Order: undefined;
  SettingsNavigator: undefined;
};
