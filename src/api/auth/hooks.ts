import { doc, getDoc, setDoc } from 'firebase/firestore';

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

/**
 * Guarantee the signed-in user has a complete `users/{uid}` document.
 *
 * Social sign-in cannot tell us reliably whether an account is new: Google may
 * hand back no displayName at all, and Apple returns fullName only on the very
 * first authorization for an app, so a returning-but-new Firebase user arrives
 * nameless. Gating document creation on having a name left those accounts with
 * an Auth record and no Firestore document, which makes every updateDoc-based
 * profile write fail with "No document to update" and blocks ordering forever.
 *
 * This only fills in fields that are absent, which makes it safe to call on
 * every sign-in. It repairs accounts already stuck without a document, never
 * overwrites a contactEmail the user has changed, and cannot clobber a
 * document that the guest-data migration created concurrently with just the
 * fields it happened to carry.
 */
export const ensureUserDocument = async (
  userProfile: Partial<UserData> = {},
) => {
  const currentUser = auth.currentUser;
  if (!currentUser?.uid) return;

  const userRef = doc(db, 'users', currentUser.uid);
  const existing = (await getDoc(userRef)).data() as
    | Record<string, unknown>
    | undefined;

  const defaults: Partial<UserData> = {
    documentId: currentUser.uid,
    email: currentUser.email ?? '',
    contactEmail: currentUser.email ?? '',
    givenName: userProfile.givenName ?? '',
    familyName: userProfile.familyName ?? '',
  };

  const missing = Object.fromEntries(
    Object.entries(defaults).filter(([field]) => existing?.[field] == null),
  );

  if (Object.keys(missing).length === 0) return;

  await setDoc(userRef, missing, { merge: true });
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
