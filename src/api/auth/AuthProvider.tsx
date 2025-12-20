import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  OAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import React, { createContext, useEffect, useMemo, useState } from 'react';

import { appleAuth } from 'utils/react-native-apple-authentication';

import { auth } from '../firebase';
import { createUser, updateUserProfile } from './hooks';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID,
});

export const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    givenName: string,
    familyName: string,
    updates?: { displayName?: string; photoURL?: string },
  ) => Promise<void>;
  update: (
    updates: { displayName?: string; photoURL?: string },
    givenName?: string,
    familyName?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  forgot: (email: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  appleLogin: () => Promise<void>;
  anonymousLogin: () => Promise<void>;
}>(undefined as any);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      setUser(authUser);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      register: async (
        email: string,
        password: string,
        givenName: string,
        familyName: string,
        updates?: { displayName?: string; photoURL?: string },
      ) => {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const authUser = userCredential.user;

        if (updates) {
          await updateProfile(authUser, updates);
        }

        await createUser({ givenName, familyName });
      },
      update: async (
        updates: { displayName?: string; photoURL?: string },
        givenName?: string,
        familyName?: string,
      ) => {
        const displayName = `${givenName} ${familyName}`.trim();
        const nameUpdates: { givenName?: string; familyName?: string } = {};
        if (givenName) nameUpdates.givenName = givenName;
        if (familyName) nameUpdates.familyName = familyName;

        const profileUpdates = { ...updates };
        if (displayName) profileUpdates.displayName = displayName;

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, profileUpdates);
          await updateUserProfile(nameUpdates);
        }
      },
      logout: async () => {
        await signOut(auth);
      },
      forgot: async (email: string) => {
        await sendPasswordResetEmail(auth, email);
      },
      googleLogin: async () => {
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
        const userCredential = await signInWithCredential(
          auth,
          googleCredential,
        );

        const user = userCredential.user;
        const isNewUser =
          user.metadata.creationTime === user.metadata.lastSignInTime;

        if (isNewUser) {
          const displayName = user.displayName;
          const nameParts = displayName?.split(' ') || [];
          const givenName = nameParts[0] || '';
          const familyName = nameParts.slice(1).join(' ') || '';

          if (givenName || familyName) {
            await createUser({
              givenName,
              familyName,
            });
          }
        }
      },
      appleLogin: async () => {
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

        const userCredential = await signInWithCredential(
          auth,
          appleCredential,
        );

        const user = userCredential.user;
        const isNewUser =
          user.metadata.creationTime === user.metadata.lastSignInTime;

        if (isNewUser && fullName) {
          await createUser({
            givenName: fullName?.givenName,
            familyName: fullName?.familyName,
          });
        }
      },
      anonymousLogin: async () => {
        await signInAnonymously(auth);
        await createUser({});
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
