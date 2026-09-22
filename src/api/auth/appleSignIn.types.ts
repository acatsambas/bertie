import type { User } from 'firebase/auth';

export type AppleSignInResult = {
  user: User;
  givenName: string;
  familyName: string;
};
