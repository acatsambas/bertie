import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, User, signInWithCredential } from 'firebase/auth';

import { auth } from '../firebase';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID,
});

export const signInWithGoogle = async (): Promise<User> => {
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  const {
    data: { idToken },
  } = await GoogleSignin.signIn();

  if (!idToken) {
    throw new Error('Google Sign-In failed - no ID token returned');
  }

  const googleCredential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, googleCredential);
  return userCredential.user;
};
