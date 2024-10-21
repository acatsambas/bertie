declare module '*.png' {
  import { ImageRequireSource } from 'react-native';
  const source: ImageRequireSource;
  export default source;
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    EXPO_PUBLIC_BOOKS_API_KEY: string;
    EXPO_PUBLIC_ANDROID_BERTIE_STORE_FILE: string;
    EXPO_PUBLIC_ANDROID_BERTIE_KEY_ALIAS: string;
    EXPO_PUBLIC_ANDROID_BERTIE_STORE_PASSWORD: string;
    EXPO_PUBLIC_ANDROID_BERTIE_KEY_PASSWORD: string;
    EXPO_PUBLIC_ANDROID_BERTIE_WEB_CLIENT_ID: string;
    EXPO_PUBLIC_OPENAI_API_KEY: string;
    EXPO_PUBLIC_OPENAI_PROJECT_ID: string;
    EXPO_PUBLIC_OPENAI_ORG_ID: string;
  }
}
