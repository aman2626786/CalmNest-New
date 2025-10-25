import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@/lib/translations';

// Base configuration
const baseConfig = {
  supportedLngs: ['en', 'hi'],
  fallbackLng: 'en',
  ns: ['common', 'translation', 'phq9', 'gad7', 'suggestions', 'dashboard', 'appointments', 'resources', 'exercises', 'forum'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
};

// Check if we're on the server side
const isServer = typeof window === 'undefined';

if (isServer) {
  // Server-side: Use pre-loaded translations for static generation
  i18n
    .use(initReactI18next)
    .init({
      ...baseConfig,
      debug: false,
      initImmediate: false,
      resources: translations,
    });
} else {
  // Client-side: use HTTP backend
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...baseConfig,
      debug: true,
      detection: {
        order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
        caches: ['cookie', 'localStorage'],
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    });
}

export default i18n;