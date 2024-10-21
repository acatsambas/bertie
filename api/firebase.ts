import { firebase as analyticsFirebase } from '@react-native-firebase/analytics';

const initAnalytics = async () => {
  await analyticsFirebase
    .analytics()
    .setAnalyticsCollectionEnabled(process.env.NODE_ENV === 'production');
};

export const initFirebase = async () => {
  await initAnalytics();
};
