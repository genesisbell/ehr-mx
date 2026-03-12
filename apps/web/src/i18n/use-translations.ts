'use client';

import { translations, DEFAULT_LOCALE, type Locale, type Namespace } from './index';

// For now, use a simple module-level locale. Can be upgraded to React context later.
let currentLocale: Locale = DEFAULT_LOCALE;

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function useTranslations<N extends Namespace>(namespace: N) {
  return translations[currentLocale][namespace];
}
