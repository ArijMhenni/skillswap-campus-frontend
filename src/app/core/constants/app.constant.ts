import { SkillCategory, SkillType } from '../models/skill.enum';

export const SUCCESS_MESSAGES = {
  SKILL: {
    CREATED: 'Compétence créée avec succès !',
    UPDATED: 'Compétence mise à jour avec succès !',
    DELETED: 'Compétence supprimée avec succès',
  },
} as const;

export const CONFIRMATION_MESSAGES = {
  SKILL: {
    DELETE: (title: string) => `Êtes-vous sûr de vouloir supprimer la compétence "${title}" ?`,
  },
} as const;

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  [SkillCategory.TECH]: 'Technologie',
  [SkillCategory.LANGUAGES]: 'Langues',
  [SkillCategory.ART]: 'Art',
  [SkillCategory.MUSIC]: 'Musique',
  [SkillCategory.SPORTS]: 'Sports',
  [SkillCategory.COOKING]: 'Cuisine',
  [SkillCategory.OTHER]: 'Autre',
  [SkillCategory.ACADEMICS]: 'Académique',
};

export const SKILL_TYPE_LABELS: Record<SkillType, string> = {
  [SkillType.OFFERED]: 'Proposée',
  [SkillType.WANTED]: 'Recherchée',
};

export const SKILL_TYPE_FORM_LABELS: Record<SkillType, string> = {
  [SkillType.OFFERED]: 'Je propose cette compétence',
  [SkillType.WANTED]: 'Je recherche cette compétence',
};

export const SKILL_TYPE_DETAIL_LABELS: Record<SkillType, string> = {
  [SkillType.OFFERED]: 'Compétence proposée',
  [SkillType.WANTED]: 'Compétence recherchée',
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
} as const;

export const TEMP_USER_ID = 'temp-user-id';
