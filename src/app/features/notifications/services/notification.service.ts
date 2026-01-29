// src/app/core/services/notification.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { tap, switchMap, startWith } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Notification } from '../../../core/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;

  // Signal pour le badge de count
  unreadCount = signal<number>(0);

  constructor() {
    // Polling toutes les 30 secondes
    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.refreshUnreadCount())
    ).subscribe();
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  refreshUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`).pipe(
      tap(response => {
        console.log('📬 Notifications non lues:', response.count);
        this.unreadCount.set(response.count);
      })
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const current = this.unreadCount();
        if (current > 0) this.unreadCount.set(current - 1);
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => this.unreadCount.set(0))
    );
  }
}