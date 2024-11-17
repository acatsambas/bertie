declare module '*.png' {
  import { ImageRequireSource } from 'react-native';
  const source: ImageRequireSource;
  export default source;
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    EXPO_PUBLIC_BOOKS_API_KEY: string;
    EXPO_PUBLIC_ANDROID_BERTIE_WEB_CLIENT_ID: string;
    EXPO_PUBLIC_APP_CHECK_ANDROID_DEBUG_TOKEN: string;
    EXPO_PUBLIC_APP_CHECK_APPLE_DEBUG_TOKEN: string;
    EXPO_PUBLIC_APP_CHECK_WEB_SITE_KEY: string;
  }
}
