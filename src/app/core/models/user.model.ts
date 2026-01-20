export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
}

export function getUserDisplayName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

export function getUserInitials(user: User): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}
