import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { UserData } from '../types';

export const updateUserProfile = async (userProfile: Partial<UserData>) =>
  firestore()
    .collection('users')
    .doc(auth().currentUser?.uid)
    .set(
      {
        ...userProfile,
        documentId: auth().currentUser?.uid,
        email: auth().currentUser?.email,
      },
      { merge: true },
    );

export const createUser = (userProfile: Partial<UserData>) =>
  firestore()
    .collection('users')
    .doc(auth().currentUser?.uid)
    .set(
      {
        ...userProfile,
        documentId: auth().currentUser?.uid,
        email: auth().currentUser?.email,
        contactEmail: auth().currentUser?.email,
      } as UserData,
      { merge: true },
    );
