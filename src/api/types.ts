import { FirebaseError as FirebaseJSError } from 'firebase/app';

export type FirebaseError = FirebaseJSError;

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error && typeof error === 'object' && 'code' in error;
}

export interface UserData {
  documentId: string;
  email: string;
  contactEmail: string;
  familyName: string;
  givenName: string;
  isFirstSearch?: boolean;
  favouriteShop?: string;
  address?: {
    firstLine?: string;
    secondLine?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}
