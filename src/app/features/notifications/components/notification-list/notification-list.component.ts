import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-list.component.html',
})
export class NotificationListComponent implements OnInit {
  private notificationService = inject(NotificationService);

  notifications = signal<Notification[]>([]);
  isLoading = signal(false);

  hasUnread = computed(() => {
    return this.notifications().some(n => !n.isRead);
  });

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading.set(true);
    
    this.notificationService.getNotifications().subscribe({
      next: (data: Notification[]) => {
        console.log('Notifications chargées:', data);
        this.notifications.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('❌ Erreur chargement notifications:', err);
        this.isLoading.set(false);
      }
    });
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        const updated = this.notifications().map(n => 
          n.id === id ? { ...n, isRead: true } : n
        );
        this.notifications.set(updated);
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        const updated = this.notifications().map(n => ({ ...n, isRead: true }));
        this.notifications.set(updated);
      }
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now.getTime() - notifDate.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return 'À l\'instant';
  }
}