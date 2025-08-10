import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type Shop = {
  id: string;
  address: string;
  city: string;
  country: string;
  description: string;
  email: string;
  name: string;
  zipcode: string;
};

export type UserShop = {
  id: string;
  shopRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;
};

export type UserBook = {
  id: string;
  bookRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;
  isRead?: boolean;
};

export type UserBookId = Pick<UserBook, 'id'>;
