import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'hi'],
    fallbackLng: 'en',
    debug: true,
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    },
    ns: ['common', 'phq9', 'gad7', 'suggestions', 'dashboard', 'appointments', 'resources', 'exercises', 'forum'],
    defaultNS: 'common',
    backend: {
      loadPath: typeof window !== 'undefined' ? '/locales/{{lng}}/{{ns}}.json' : `http://localhost:3000/locales/{{lng}}/{{ns}}.json`,
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
