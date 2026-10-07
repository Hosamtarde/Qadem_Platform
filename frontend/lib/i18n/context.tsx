"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { dictionaries, Language, TranslationKey } from "./dictionaries";

const STORAGE_KEY = "qadem.language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (next: Language) => void;
  toggleLanguage: () => void;
  t: (
    key: TranslationKey | string,
    vars?: Record<string, string | number>,
  ) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// The chosen language lives in localStorage, which is an external store as far
// as React is concerned. Reading it through useSyncExternalStore keeps the
// server render ("en") and the first client render consistent, and avoids
// setting state from an effect.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Language {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

function getServerSnapshot(): Language {
  return "en";
}

function writeLanguage(next: Language) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Blocked storage should never stop the interface from switching.
  }
  listeners.forEach((listener) => listener());
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    writeLanguage(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    writeLanguage(getSnapshot() === "ar" ? "en" : "ar");
  }, []);

  const t = useCallback(
    (key: TranslationKey | string, vars?: Record<string, string | number>) => {
      const template =
        dictionaries[language][key] ?? dictionaries.en[key] ?? key;
      if (!vars) return template;
      return Object.entries(vars).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        template,
      );
    },
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      dir: language === "ar" ? "rtl" : "ltr",
    }),
    [language, setLanguage, toggleLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
