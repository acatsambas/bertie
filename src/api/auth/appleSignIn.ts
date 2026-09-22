import { OAuthProvider, signInWithCredential } from 'firebase/auth';

import { appleAuth } from 'utils/react-native-apple-authentication';

import { auth } from '../firebase';
import type { AppleSignInResult } from './appleSignIn.types';

export type { AppleSignInResult };

export const signInWithApple = async (): Promise<AppleSignInResult> => {
  if (!appleAuth.isSupported) {
    throw new Error('Apple Sign-In failed - platform unavailable');
  }

  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

  const { identityToken, nonce, fullName } = appleAuthRequestResponse;
  const provider = new OAuthProvider('apple.com');
  const appleCredential = provider.credential({
    idToken: identityToken,
    rawNonce: nonce,
  });

  const userCredential = await signInWithCredential(auth, appleCredential);

  return {
    user: userCredential.user,
    givenName: fullName?.givenName ?? '',
    familyName: fullName?.familyName ?? '',
  };
};
