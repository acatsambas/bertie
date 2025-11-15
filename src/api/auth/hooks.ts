import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from '../firebase';
import { UserData } from '../types';

export const updateUserProfile = async (userProfile: Partial<UserData>) => {
  const currentUser = auth.currentUser;
  if (!currentUser?.uid) return;

  await setDoc(
    doc(db, 'users', currentUser.uid),
    {
      ...userProfile,
      documentId: currentUser.uid,
      email: currentUser.email,
    },
    { merge: true },
  );
};

export const createUser = (userProfile: Partial<UserData>) => {
  const currentUser = auth.currentUser;
  if (!currentUser?.uid) return Promise.resolve();

  return setDoc(
    doc(db, 'users', currentUser.uid),
    {
      ...userProfile,
      documentId: currentUser.uid,
      email: currentUser.email,
      contactEmail: currentUser.email,
    } as UserData,
    { merge: true },
  );
};
