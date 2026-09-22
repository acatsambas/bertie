import type { AppleSignInResult } from './appleSignIn.types';

export type { AppleSignInResult };

export const signInWithApple = async (): Promise<AppleSignInResult> => {
  throw new Error('Apple Sign-In is only available on iOS');
};
