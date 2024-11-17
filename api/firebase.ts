import { firebase as analyticsFirebase } from '@react-native-firebase/analytics';
import appCheck from '@react-native-firebase/app-check';

const initAnalytics = async () => {
  await analyticsFirebase
    .analytics()
    .setAnalyticsCollectionEnabled(process.env.NODE_ENV === 'production');
};

export const initAppCheck = async () => {
  const rnfbProvider = appCheck().newReactNativeFirebaseAppCheckProvider();
  rnfbProvider.configure({
    android: {
      provider: __DEV__ ? 'debug' : 'playIntegrity',
      debugToken: process.env.EXPO_PUBLIC_APP_CHECK_ANDROID_DEBUG_TOKEN,
    },
    apple: {
      provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
      debugToken: process.env.EXPO_PUBLIC_APP_CHECK_APPLE_DEBUG_TOKEN,
    },
    web: {
      provider: __DEV__ ? 'debug' : 'reCaptchaV3',
      siteKey: process.env.EXPO_PUBLIC_APP_CHECK_WEB_SITE_KEY,
    },
  });
  await appCheck().initializeAppCheck({
    provider: rnfbProvider,
    isTokenAutoRefreshEnabled: true,
  });

  try {
    const { token } = await appCheck().getToken(true);

    if (token.length > 0) {
      console.log('AppCheck verification passed');
    }
  } catch {
    console.log('AppCheck verification failed');
  }
};

export const initFirebase = async () => {
  await initAppCheck();
  await initAnalytics();
};
