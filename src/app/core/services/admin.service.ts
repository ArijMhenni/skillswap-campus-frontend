import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../../core/models/user.model';
import { Skill, PaginatedResponse } from '../../core/models/skill.model';
import {
  AdminStats,
  AdminQueryParams,
  BanUserDto,
} from '../models/admin-stats.model';
import {
  Report,
  CreateReportDto,
  ResolveReportDto,
  ReportFilters,
} from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers(params: AdminQueryParams = {}): Observable<PaginatedResponse<User>> {
    let httpParams = new HttpParams();

    if (params.page)
      httpParams = httpParams.set('page', params.page.toString());
    if (params.limit)
      httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PaginatedResponse<User>>(
      `${this.apiUrl}/admin/users`,
      { params: httpParams },
    );
  }

  banUser(
    userId: string,
    dto: BanUserDto,
  ): Observable<{ message: string; user: User }> {
    return this.http.patch<{ message: string; user: User }>(
      `${this.apiUrl}/admin/users/${userId}/ban`,
      dto,
    );
  }

  unbanUser(userId: string): Observable<{ message: string; user: User }> {
    return this.http.patch<{ message: string; user: User }>(
      `${this.apiUrl}/admin/users/${userId}/unban`,
      {},
    );
  }

  deleteSkill(skillId: string): Observable<{ message: string; skill: Skill }> {
    return this.http.delete<{ message: string; skill: Skill }>(
      `${this.apiUrl}/admin/skills/${skillId}`,
    );
  }

  getReports(
    filters: ReportFilters = {},
  ): Observable<PaginatedResponse<Report>> {
    let httpParams = new HttpParams();

    if (filters.status) httpParams = httpParams.set('status', filters.status);
    if (filters.page)
      httpParams = httpParams.set('page', filters.page.toString());
    if (filters.limit)
      httpParams = httpParams.set('limit', filters.limit.toString());

    return this.http.get<PaginatedResponse<Report>>(
      `${this.apiUrl}/admin/reports`,
      { params: httpParams },
    );
  }

  createReport(dto: CreateReportDto): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/reports`, dto);
  }

  resolveReport(
    reportId: string,
    dto: ResolveReportDto,
  ): Observable<{ message: string; report: Report }> {
    return this.http.patch<{ message: string; report: Report }>(
      `${this.apiUrl}/admin/reports/${reportId}/resolve`,
      dto,
    );
  }

  getStatistics(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/admin/statistics`);
  }
}
