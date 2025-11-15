import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import en from './en/translation.json';
import { convertLanguageJsonToObject } from './translations';

let deviceLanguage = 'en';
if (Platform.OS === 'ios') {
  try {
    const settingsManager = NativeModules.SettingsManager;
    if (settingsManager?.settings) {
      deviceLanguage =
        settingsManager.settings.AppleLocale ||
        settingsManager.settings.AppleLanguages?.[0] ||
        'en';
    } else {
      // Fallback to Intl API if SettingsManager is not available (new architecture)
      deviceLanguage = Intl.DateTimeFormat().resolvedOptions().locale || 'en';
    }
  } catch (error) {
    // SettingsManager might not be available with new architecture
    // Fallback to Intl API
    try {
      deviceLanguage = Intl.DateTimeFormat().resolvedOptions().locale || 'en';
    } catch (intlError) {
      console.warn('Failed to get iOS locale:', error);
    }
  }
} else if (Platform.OS === 'web') {
  deviceLanguage = navigator.language;
} else {
  deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
}

export const translationsJson = {
  en: {
    translation: en,
  },
};

// Create the 'translations' object to provide full intellisense support for the static json files.
convertLanguageJsonToObject(en);

export const i18n = i18next
  .use(initReactI18next)
  .use({
    init: Function.prototype,
    type: 'languageDetector',
    detect: () => deviceLanguage?.replace('_', '-') || 'en',
    cacheUserLanguage: Function.prototype,
  })
  .init({
    returnNull: false,
    resources: translationsJson,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    compatibilityJSON: 'v3',
  });
