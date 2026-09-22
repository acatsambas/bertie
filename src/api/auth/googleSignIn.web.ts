import { GoogleAuthProvider, User, signInWithPopup } from 'firebase/auth';

import { auth } from '../firebase';

export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};
