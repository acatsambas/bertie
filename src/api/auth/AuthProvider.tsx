import {
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import React, { createContext, useEffect, useMemo, useState } from 'react';

import { auth } from '../firebase';
import { signInWithApple } from './appleSignIn';
import { signInWithGoogle } from './googleSignIn';
import { createUser, ensureUserDocument, updateUserProfile } from './hooks';

export const AuthContext = createContext<{
  user: User | null;
  authLoading: boolean;
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
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  googleLogin: () => Promise<void>;
  appleLogin: () => Promise<void>;
}>(undefined as any);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      setUser(authUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      authLoading,
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
        const displayName =
          updates?.displayName?.trim() ||
          `${givenName} ${familyName}`.trim() ||
          undefined;

        await updateProfile(authUser, {
          ...updates,
          ...(displayName ? { displayName } : null),
        });

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
      changePassword: async (currentPassword: string, newPassword: string) => {
        const currentUser = auth.currentUser;
        if (!currentUser?.email) {
          throw new Error('No authenticated email user');
        }

        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword,
        );
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
      },
      googleLogin: async () => {
        const authUser = await signInWithGoogle();
        const nameParts = authUser.displayName?.split(' ') ?? [];

        // Runs on every Google sign-in: the document is only written when it
        // is missing, so this creates it for accounts with no displayName and
        // repairs any that were skipped before, while leaving healthy
        // profiles — and any contactEmail the user has changed — untouched.
        await ensureUserDocument({
          givenName: nameParts[0] || '',
          familyName: nameParts.slice(1).join(' '),
        });
      },
      appleLogin: async () => {
        const { givenName, familyName } = await signInWithApple();

        // Apple only returns fullName on the very first authorization for the
        // app, so a user who re-registers arrives nameless. Write the document
        // regardless and fill the name in when Apple does give us one.
        await ensureUserDocument({ givenName, familyName });
      },
    }),
    [user, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
