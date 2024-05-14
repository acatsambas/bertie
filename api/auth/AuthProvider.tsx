import React, { createContext, useEffect, useMemo, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";

import { createUser, updateUserProfile } from "./hooks";

export const AuthContext = createContext<{
  user: FirebaseAuthTypes.User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    givenName: string,
    familyName: string,
    updates?: FirebaseAuthTypes.UpdateProfile
  ) => Promise<void>;
  update: (
    updates: FirebaseAuthTypes.UpdateProfile,
    givenName?: string,
    familyName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  forgot: (email: string) => Promise<void>;
}>(undefined as any);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onUserChanged((authUser) => {
      // called each time the user changes
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      // get the current signed-in user
      setUser(authUser);

      (async () => {
        const fcmToken = await messaging().getToken();

        if (authUser?.uid && fcmToken) {
          firestore()
            .collection("users")
            .doc(authUser?.uid)
            .set({ fcmToken }, { merge: true });
        }
      })();
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
        updates?: FirebaseAuthTypes.UpdateProfile
      ) => {
        const { user: authUser } = await auth().createUserWithEmailAndPassword(
          email,
          password
        );
        updates && (await authUser.updateProfile(updates));
        await createUser({ givenName, familyName });
      },
      update: async (
        updates: FirebaseAuthTypes.UpdateProfile,
        givenName?: string,
        familyName?: string
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
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
