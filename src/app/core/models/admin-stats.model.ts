export interface AdminStats {
  totalUsers: number;
  bannedUsers: number;
  activeUsers: number;
  activeSkills: number;
  pendingReports: number;
}

export interface AdminQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface BanUserDto {
  reason: string;
}
