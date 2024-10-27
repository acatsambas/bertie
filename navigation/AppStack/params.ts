export type SettingsNavigatorParamList = {
  Settings: undefined;
  ChangeAddress: undefined;
  ResetPassword: undefined;
  DeleteAccount: undefined;
};

export type LibraryNavigatorParamList = {
  Library: undefined;
  Book: {
    bookName?: string;
    author?: string;
    isMyList?: boolean;
    id?: string;
    description?: string;
  };
  Search: undefined;
};

export type BookshopType = {
  id: string;
  address: string;
  city: string;
  country: string;
  name: string;
  zipcode: string;
  description: string;
  isFav: boolean;
};

export type DiscoverNavigatorParamList = {
  Discover: undefined;
  Bookshop: BookshopType;
};

export type BookType = {
  author?: string;
  bookId?: string;
  id?: string;
  isRead?: boolean;
  description?: string;
  title?: string;
};

export type OrderNavigatorParamList = {
  Order: undefined;
  OrderShop: BookType[];
  AddressScreen: undefined;
  Bookshop: BookshopType;
  OrderPlaced: undefined;
};

export type AppNavigatorParamList = {
  DiscoverNavigator: undefined;
  LibraryNavigator: undefined;
  OrderNavigator: undefined;
  SettingsNavigator: undefined;
};
