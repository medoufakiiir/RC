import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getSavedLocale, saveLocale, getTranslation, type Locale } from './i18n';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale());

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale === 'ar' ? 'ar' : 'en';
    saveLocale(locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: (next: Locale) => setLocaleState(next),
      t: (key: string) => getTranslation(locale, key),
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
