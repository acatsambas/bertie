import { ReactNativeFirebase } from "@react-native-firebase/app";

export type FirebaseError = ReactNativeFirebase.NativeFirebaseError;

export function isFirebaseError(error: unknown): error is FirebaseError {
  if (error && typeof error === "object" && "code" in error) {
    return true;
  }
  return false;
}

export interface UserData {
  givenName: string;
  familyName: string;
  email: string;
  documentId: string;
  fcmToken?: string;
}
