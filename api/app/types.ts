import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Shop {
  id: string;
  address: string;
  city: string;
  country: string;
  description: string;
  email: string;
  name: string;
  zipcode: string;
}

export interface UserShop {
  id: string;
  shopRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;
}

export interface UserBook {
  id: string;
  bookRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;
  isRead?: boolean;
}
