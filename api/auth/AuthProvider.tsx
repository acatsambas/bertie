import React, { createContext, useEffect, useMemo, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { createUser, updateUserProfile } from './hooks';
import { appleAuth } from '../../utils/react-native-apple-authentication';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.EXPO_PUBLIC_ANDROID_BERTIE_WEB_CLIENT_ID,
});

export const AuthContext = createContext<{
  user: FirebaseAuthTypes.User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    givenName: string,
    familyName: string,
    updates?: FirebaseAuthTypes.UpdateProfile,
  ) => Promise<void>;
  update: (
    updates: FirebaseAuthTypes.UpdateProfile,
    givenName?: string,
    familyName?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  forgot: (email: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  appleLogin: () => Promise<void>;
}>(undefined as any);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onUserChanged(authUser => {
      // called each time the user changes
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      // get the current signed-in user
      setUser(authUser);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      login: async (email: string, password: string) => {
        await auth().signInWithEmailAndPassword(email, password);
      },
      register: async (
        email: string,
        password: string,
        givenName: string,
        familyName: string,
        updates?: FirebaseAuthTypes.UpdateProfile,
      ) => {
        const { user: authUser } = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        updates && (await authUser.updateProfile(updates));
        await createUser({ givenName, familyName });
      },
      update: async (
        updates: FirebaseAuthTypes.UpdateProfile,
        givenName?: string,
        familyName?: string,
      ) => {
        const displayName = `${givenName} ${familyName}`.trim();
        const nameUpdates: { givenName?: string; familyName?: string } = {};
        if (givenName) nameUpdates.givenName = givenName;
        if (familyName) nameUpdates.familyName = familyName;

        const profileUpdates = updates;
        if (displayName) profileUpdates.displayName = displayName;

        await auth().currentUser?.updateProfile(profileUpdates);
        await updateUserProfile(nameUpdates);
      },
      logout: async () => {
        await auth().signOut();
      },
      forgot: async (email: string) => {
        await auth().sendPasswordResetEmail(email);
      },
      googleLogin: async () => {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });

        // Get the users ID token
        const {
          data: { idToken },
        } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        const authUser = await auth().signInWithCredential(googleCredential);

        await createUser({
          givenName: authUser.additionalUserInfo?.profile?.given_name!,
          familyName: authUser.additionalUserInfo?.profile?.family_name!,
        });
      },
      appleLogin: async () => {
        if (!appleAuth.isSupported) {
          throw new Error('Apple Sign-In failed - platform unavailable');
        }

        // Start the sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
          throw new Error('Apple Sign-In failed - no identify token returned');
        }

        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
        );

        // Sign the user in with the credential
        await auth().signInWithCredential(appleCredential);

        await createUser({});
      },
      anonymousLogin: async () => {
        await auth().signInAnonymously();

        await createUser({});
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
