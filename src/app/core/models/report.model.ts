import { User } from '../../core/models/user.model';
import { ReportTargetType, ReportStatus } from './report.enum';

export interface Report {
  id: string;
  reporter: User;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  resolvedBy?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportDto {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
}

export interface ResolveReportDto {
  status: ReportStatus;
  adminNotes?: string;
}

export interface ReportFilters {
  status?: ReportStatus;
  page?: number;
  limit?: number;
}
