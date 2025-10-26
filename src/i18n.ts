import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Pre-loaded translations for static generation
const translations = {
  en: {
    common: {
      "nav": {
        "dashboard": "Dashboard",
        "selfCheck": "Self-Check",
        "appointments": "Appointments",
        "resources": "Resources",
        "forum": "Forum",
        "exercises": "Breathing",
        "musicTherapy": "Music Therapy",
        "moodGroove": "Mood Groove",
        "feedback": "Feedback"
      },
      "hero": {
        "title": "Your Mind Matters",
        "subtitle": "A Safe Digital Space for Students to Prioritize their Mental Well-being.",
        "cta": "Start Self-Check",
        "comprehensiveAssessment": "Complete Mental Health Assessment",
        "comprehensiveDescription": "Comprehensive evaluation combining PHQ-9, GAD-7, Mood Analysis & more",
        "quickSelfCheck": "Quick Self-Check"
      },
      "features": {
        "title": "Support Designed for You",
        "subtitle": "We provide a comprehensive suite of tools to help you navigate the challenges of student life.",
        "cards": {
          "symptom": {
            "title": "Self-Check",
            "description": "Use PHQ-9 & GAD-7 to understand your mental state."
          },
          "appointments": {
            "title": "Appointments",
            "description": "Anonymously book a session with a professional counsellor."
          },
          "resources": {
            "title": "Resources",
            "description": "Explore a rich library of videos, audio guides, and articles."
          },
          "groove": {
            "title": "Mood Groove",
            "description": "Detect your mood in real-time using your camera."
          },
          "community": {
            "title": "Forum",
            "description": "Connect with fellow students in a safe, anonymous space."
          },
          "breathing": {
            "title": "Guided Breathing",
            "description": "Practice simple breathing exercises to calm your mind."
          }
        }
      },
      "testimonials": {
        "title": "What Our Users Say",
        "subtitle": "Real stories from students who found support and hope through CalmNest."
      },
      "selfCheck": {
        "title": "Check Your Mental Wellness",
        "description": "These brief, confidential screenings are tools to help you understand your emotional well-being.",
        "phq9Title": "Depression Test (PHQ-9)",
        "phq9Description": "This 9-question screening can help you understand if you might be experiencing symptoms of depression.",
        "gad7Title": "Anxiety Test (GAD-7)",
        "gad7Description": "This 7-question screening is used to measure the severity of generalized anxiety disorder symptoms.",
        "startTest": "Start Test"
      },
      "crisisHelp": {
        "title": "In Crisis? Help is Available.",
        "description": "If you are in immediate distress, please don't hesitate to reach out. Our crisis helplines provide confidential, free support 24/7.",
        "button": "Find Help Now"
      },
      "footer": {
        "about": {
          "title": "About Us"
        },
        "legal": {
          "privacy": "Privacy Policy"
        },
        "emergency": {
          "helplines": "Crisis Helplines"
        },
        "contact": "Contact Us",
        "copyright": "© 2025 CalmNest. All rights reserved.",
        "disclaimer": "Disclaimer: This platform is for support and not a substitute for professional medical advice. In a crisis, please contact a helpline."
      }
    }
  },
  hi: {
    common: {
      // Hindi translations would go here
    }
  }
};

// Base configuration
const baseConfig = {
  supportedLngs: ['en', 'hi'],
  fallbackLng: 'en',
  ns: ['common', 'translation', 'phq9', 'gad7', 'suggestions', 'appointments', 'resources', 'exercises', 'forum', 'dashboard'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
};

// Initialize i18n with embedded translations for both server and client
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...baseConfig,
    debug: false,
    resources: translations,
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    },
    // Add backend configuration for loading translation files
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

// Load additional namespaces dynamically
const loadNamespace = async (lng: string, ns: string) => {
  try {
    const response = await fetch(`/locales/${lng}/${ns}.json`);
    if (response.ok) {
      const translations = await response.json();
      i18n.addResourceBundle(lng, ns, translations, true, true);
    }
  } catch (error) {
    console.warn(`Failed to load ${ns} translations for ${lng}:`, error);
  }
};

// Pre-load common, PHQ9, GAD7, and Dashboard translations
if (typeof window !== 'undefined') {
  loadNamespace('en', 'common');
  loadNamespace('en', 'phq9');
  loadNamespace('en', 'gad7');
  loadNamespace('en', 'dashboard');
  loadNamespace('hi', 'common');
  loadNamespace('hi', 'phq9');
  loadNamespace('hi', 'gad7');
  loadNamespace('hi', 'dashboard');
}

export default i18n;