import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Request, CreateRequestDto, RequestStatus } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/requests`;

  createRequest(data: CreateRequestDto): Observable<Request> {
    return this.http.post<Request>(this.apiUrl, data);
  }

  getMyRequests(filters?: { status?: RequestStatus; role?: 'asRequester' | 'asProvider' }): Observable<Request[]> {
    let params = new HttpParams();
    
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.role) {
      params = params.set('role', filters.role);
    }

    return this.http.get<Request[]>(`${this.apiUrl}/my`, { params });
  }

  getRequestById(id: string): Observable<Request> {
    return this.http.get<Request>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: RequestStatus): Observable<Request> {
    return this.http.patch<Request>(`${this.apiUrl}/${id}/status`, { status });
  }
}