import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  notificationCount = signal(0);
  currentUser = signal<User | null>(null);
  currentUrl = signal('');

  constructor() {
    // Subscribe to current user
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });

    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl.set(event.url);
      });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    const first = user.firstName?.charAt(0).toUpperCase() || '';
    const last = user.lastName?.charAt(0).toUpperCase() || '';
    return first + last || user.email.charAt(0).toUpperCase();
  }

  onSearchClick(): void {
    console.log('Search clicked');
  }

  onNotificationClick(): void {
    console.log('Notifications clicked');
  }

  onProfileClick(): void {
    this.router.navigate(['/auth/profile']);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
