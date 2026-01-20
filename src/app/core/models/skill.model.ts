import { SkillCategory, SkillType, SkillStatus } from './skill.enum';
import { User } from './user.model';

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  type: SkillType;
  estimatedTime: number;
  status: SkillStatus;
  userId?: string;
  user?: User;
  createdAt: Date;
}

export interface CreateSkillDto {
  title: string;
  description: string;
  category: SkillCategory;
  type: SkillType;
  estimatedTime: number;
}

export interface UpdateSkillDto {
  title?: string;
  description?: string;
  category?: SkillCategory;
  type?: SkillType;
  estimatedTime?: number;
  status?: SkillStatus;
}

export interface SkillFilters {
  category?: SkillCategory;
  type?: SkillType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
