import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Skill,
  CreateSkillDto,
  UpdateSkillDto,
  SkillFilters,
  PaginatedResponse,
} from '../models/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private apiUrl = `${environment.apiUrl}/skills`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of skills with optional filters
   * @param filters - Optional filters (category, type, search, page, limit)
   * @returns Observable of paginated skills
   */
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

  /**
   * Get a single skill by ID
   * @param id - Skill ID
   * @returns Observable of skill
   */
  getSkillById(id: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get skills by user ID
   * @param userId - User ID
   * @returns Observable of skills array
   */
  getSkillsByUser(userId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Create a new skill
   * @param data - Skill data
   * @returns Observable of created skill
   */
  createSkill(data: CreateSkillDto): Observable<Skill> {
    return this.http.post<Skill>(this.apiUrl, data);
    // TODO: Ajouter le token JWT dans les headers quand l'authentification sera implémentée
    // return this.http.post<Skill>(this.apiUrl, data, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
  }

  /**
   * Update an existing skill
   * @param id - Skill ID
   * @param data - Updated skill data
   * @returns Observable of updated skill
   */
  updateSkill(id: string, data: UpdateSkillDto): Observable<Skill> {
    return this.http.patch<Skill>(`${this.apiUrl}/${id}`, data);
    // TODO: Ajouter le token JWT dans les headers quand l'authentification sera implémentée
    // return this.http.patch<Skill>(`${this.apiUrl}/${id}`, data, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
  }

  /**
   * Delete a skill (soft delete)
   * @param id - Skill ID
   * @returns Observable of void
   */
  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // TODO: Ajouter le token JWT dans les headers quand l'authentification sera implémentée
    // return this.http.delete<void>(`${this.apiUrl}/${id}`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
  }
}
