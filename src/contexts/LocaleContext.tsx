import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import translations from '../locales';

// Define the available locales
type Locale = 'ru' | 'kk';

// Define the LocaleContext type
interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

// Create context with default values
const LocaleContext = createContext<LocaleContextType>({
  locale: 'ru',
  setLocale: () => {},
  t: (key) => key,
});

// Provider component
interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  // Try to get the saved locale from localStorage, default to 'ru'
  const [locale, setLocale] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale');
    return (savedLocale === 'ru' || savedLocale === 'kk') ? savedLocale : 'ru';
  });

  // Update localStorage when locale changes
  useEffect(() => {
    localStorage.setItem('locale', locale);
    // Update HTML lang attribute
    document.documentElement.lang = locale;
    // Update document title
    const titleElement = document.querySelector('title');
    if (titleElement?.hasAttribute('data-default')) {
      titleElement.textContent = translations[locale].appName || 'Legal AI';
    }
  }, [locale]);

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[locale][key] || translations.ru[key] || key;
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, paramValue);
      });
    }
    
    return translation;
  };

  const value = {
    locale,
    setLocale,
    t,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

// Custom hook to use the locale context
export const useLocale = () => useContext(LocaleContext);