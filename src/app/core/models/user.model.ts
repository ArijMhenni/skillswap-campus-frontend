export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  offeredSkills: string[] | null;
  wantedSkills: string[] | null;
  availability: string | null;
  avatar?: string | null ; 
  rating?: number; 
  reviewCount?: number; 
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  offeredSkills?: string[];
  wantedSkills?: string[];
  availability?: string;
  avatar?: string;
}

// Utility functions pour Skills module
export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return 'Unknown User';
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}

export function getUserInitials(user: User | null | undefined): string {
  if (!user) return '?';
  const firstInitial = user.firstName?.charAt(0).toUpperCase() || '';
  const lastInitial = user.lastName?.charAt(0).toUpperCase() || '';
  return firstInitial + lastInitial || user.email.charAt(0).toUpperCase();
}