import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Rating,
  PendingRating,
  UserReputationSummary,
  CreateRatingDto,
} from '../../../core/models/rating.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private apiUrl = `${environment.apiUrl}/ratings`;

  constructor(private http: HttpClient) {}

  // Creer une evaluation
  createRating(dto: CreateRatingDto): Observable<Rating> {
    return this.http.post<Rating>(this.apiUrl, dto);
  }

  // Obtenir mes evaluations recues
  getReceivedRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/received`);
  }

  // Obtenir mes evaluations donnees
  getGivenRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/given`);
  }

  // Obtenir mon resume de reputation
  getMyReputation(): Observable<UserReputationSummary> {
    return this.http.get<UserReputationSummary>(`${this.apiUrl}/my-reputation`);
  }

  // Obtenir les evaluations en attente
  getPendingRatings(): Observable<PendingRating[]> {
    return this.http.get<PendingRating[]>(`${this.apiUrl}/pending`);
  }

  // Obtenir les evaluations d'un utilisateur (public)
  getUserRatings(userId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Obtenir le resume de reputation d'un utilisateur (public)
  getUserReputation(userId: string): Observable<UserReputationSummary> {
    return this.http.get<UserReputationSummary>(
      `${this.apiUrl}/user/${userId}/summary`
    );
  }
}