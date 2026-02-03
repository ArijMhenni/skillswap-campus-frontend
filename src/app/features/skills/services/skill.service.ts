import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Skill,
  CreateSkillDto,
  UpdateSkillDto,
  SkillFilters,
  PaginatedResponse,
} from '../../../core/models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private apiUrl = `${environment.apiUrl}/skills`;

  constructor(private http: HttpClient) {}

  getSkills(filters?: SkillFilters): Observable<PaginatedResponse<Skill>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.category) {
        params = params.set('category', filters.category);
      }
      if (filters.type) {
        params = params.set('type', filters.type);
      }
      if (filters.search) {
        params = params.set('search', filters.search);
      }
      if (filters.page) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.limit) {
        params = params.set('limit', filters.limit.toString());
      }
    }

    return this.http.get<PaginatedResponse<Skill>>(this.apiUrl, { params });
  }

  getSkillById(id: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/${id}`);
  }

  getSkillsByUser(userId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/user/${userId}`);
  }

  
  createSkill(data: CreateSkillDto): Observable<Skill> {
    return this.http.post<Skill>(this.apiUrl, data);
  }

  updateSkill(id: string, data: UpdateSkillDto): Observable<Skill> {
    return this.http.patch<Skill>(`${this.apiUrl}/${id}`, data);
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
