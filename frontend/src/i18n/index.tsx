import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultLanguage, normalizeLanguage, supportedLanguages, translations, type Language } from "./translations";

const STORAGE_KEY = "amulya-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (value: Language) => void;
  t: (key: string, fallback?: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getNestedValue = (obj: unknown, key: string): unknown => {
  return key.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, obj);
};

export const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  const normalized = normalizeLanguage(saved);

  if (supportedLanguages.includes(normalized)) {
    return normalized;
  }

  const browserLanguage = window.navigator.language.toLowerCase();

  if (browserLanguage.startsWith("hi")) {
    return "hi";
  }

  if (browserLanguage.startsWith("mr")) {
    return "mr";
  }

  return defaultLanguage;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (value: Language) => {
    setLanguageState(value);
  };

  const t = useMemo(() => {
    return (key: string, fallback?: string) => {
      const value = getNestedValue(translations[language], key);
      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }

      const defaultValue = getNestedValue(translations[defaultLanguage], key);
      if (typeof defaultValue === "string" && defaultValue.trim().length > 0) {
        return defaultValue;
      }

      return fallback ?? key;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
};
