import { ReactNativeFirebase } from '@react-native-firebase/app';

export type FirebaseError = ReactNativeFirebase.NativeFirebaseError;

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error && typeof error === 'object' && 'code' in error;
}

export interface UserData {
  givenName: string;
  familyName: string;
  email: string;
  documentId: string;
}
