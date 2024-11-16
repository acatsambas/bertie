import { ReactNativeFirebase } from '@react-native-firebase/app';

export type FirebaseError = ReactNativeFirebase.NativeFirebaseError;

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error && typeof error === 'object' && 'code' in error;
}

export interface UserData {
  documentId: string;
  email: string;
  familyName: string;
  givenName: string;
  isFirstSearch?: boolean;
  favouriteShop?: string;
  address?: {
    // TODO: make those required...
    firstLine?: string;
    secondLine?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}
