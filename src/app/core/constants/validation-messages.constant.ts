export const VALIDATION_MESSAGES = {
  MIN_LENGTH: (min: number) => `Minimum ${min} caractères`,
  MAX_LENGTH: (max: number) => `Maximum ${max} caractères`,
  MIN_VALUE: (min: number) => `La valeur minimale est ${min}`,
  MAX_VALUE: (max: number) => `La valeur maximale est ${max}`,
  REQUIRED: 'Ce champ est requis',
  INVALID: 'Champ invalide',
} as const;

export const SKILL_VALIDATION = {
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  ESTIMATED_TIME: {
    MIN: 1,
    MAX: 1000,
  },
} as const;
