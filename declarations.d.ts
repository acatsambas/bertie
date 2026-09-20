declare module '*.png' {
  import { ImageRequireSource } from 'react-native';
  const source: ImageRequireSource;
  export default source;
}

declare module '*.ttf' {
  const source: number;
  export default source;
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    EXPO_PUBLIC_BOOKS_API_KEY: string;
    EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID: string;
    EXPO_PUBLIC_FIREBASE_API_KEY: string;
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    EXPO_PUBLIC_FIREBASE_APP_ID_WEB: string;
    EXPO_PUBLIC_OPENAI_API_KEY: string;
    EXPO_PUBLIC_OPENAI_PROJECT_ID: string;
    EXPO_PUBLIC_OPENAI_ORG_ID: string;
  }
}
