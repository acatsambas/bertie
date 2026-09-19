import {
  Analytics,
  getAnalytics,
  setAnalyticsCollectionEnabled,
} from 'firebase/analytics';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import {
  Firestore,
  enableIndexedDbPersistence,
  getFirestore,
} from 'firebase/firestore';
import 'react-native-get-random-values';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID_WEB,
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

let analytics: Analytics | null = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Firebase Analytics initialization failed:', error);
}

const initFirestorePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.log('Firestore persistence enabled (web)');
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (error.code === 'unimplemented') {
      console.warn('Firestore persistence not supported on this platform');
    } else {
      console.warn('Firestore persistence error:', error);
    }
  }
};

const initAnalytics = async () => {
  if (analytics) {
    try {
      await setAnalyticsCollectionEnabled(
        analytics,
        process.env.NODE_ENV === 'production',
      );
      console.log(
        'Analytics collection enabled:',
        process.env.NODE_ENV === 'production',
      );
    } catch (error) {
      console.warn('Failed to set analytics collection enabled:', error);
    }
  }
};

export const initFirebase = async () => {
  try {
    await initFirestorePersistence();
    await initAnalytics();
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

export { app };
