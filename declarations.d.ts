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
  }
}
