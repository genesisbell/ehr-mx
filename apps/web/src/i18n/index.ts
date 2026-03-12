import esGeneral from './es/general.json';
import esPatients from './es/patients.json';
import esValidation from './es/validation.json';
import enGeneral from './en/general.json';
import enPatients from './en/patients.json';
import enValidation from './en/validation.json';

export const translations = {
  es: {
    general: esGeneral,
    patients: esPatients,
    validation: esValidation,
  },
  en: {
    general: enGeneral,
    patients: enPatients,
    validation: enValidation,
  },
} as const;

export type Locale = keyof typeof translations;
export type Namespace = keyof (typeof translations)['es'];

export const DEFAULT_LOCALE: Locale = 'es';
