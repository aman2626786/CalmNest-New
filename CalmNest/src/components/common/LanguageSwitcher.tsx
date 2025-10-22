'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
  ];

  // Render nothing on the server and during the initial client render
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          disabled={i18n.language === lang.code}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors 
            ${i18n.language === lang.code 
              ? 'bg-purple-600 text-white cursor-default' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
