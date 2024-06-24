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
  Discover: undefined;
  Library: undefined;
  Order: undefined;
  Settings: undefined;
};
