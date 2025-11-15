// i18next.d.ts
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    // returnNull option was removed in i18next v25
    // Missing keys will return the key itself instead of null
  }
}
