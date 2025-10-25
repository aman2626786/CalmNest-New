import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

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
  // Server-side: Load translations synchronously for static generation
  let resources: any = { en: {}, hi: {} };
  
  try {
    // Try to load translation files synchronously during build
    const fs = require('fs');
    const path = require('path');
    
    const localesPath = path.join(process.cwd(), 'public', 'locales');
    const languages = ['en', 'hi'];
    const namespaces = baseConfig.ns;
    
    languages.forEach(lang => {
      resources[lang] = {};
      namespaces.forEach(ns => {
        try {
          const filePath = path.join(localesPath, lang, `${ns}.json`);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            resources[lang][ns] = JSON.parse(content);
          }
        } catch (error) {
          console.warn(`Failed to load ${lang}/${ns}.json:`, error.message);
        }
      });
    });
  } catch (error) {
    console.warn('Failed to load translation files during build:', error.message);
  }

  i18n
    .use(initReactI18next)
    .init({
      ...baseConfig,
      debug: false,
      initImmediate: false,
      resources,
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