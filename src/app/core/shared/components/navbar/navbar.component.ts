import { Component, inject, OnInit } from '@angular/core';
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
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  notificationCount = 0;
  currentUser: User | null = null;
  currentUrl = '';

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const first = this.currentUser.firstName?.charAt(0).toUpperCase() || '';
    const last = this.currentUser.lastName?.charAt(0).toUpperCase() || '';
    return first + last || this.currentUser.email.charAt(0).toUpperCase();
  }

  shouldShowLogout(): boolean {
    // Hide logout button ONLY on login and register pages
    return !this.currentUrl.startsWith('/auth/login') && 
           !this.currentUrl.startsWith('/auth/register');
  }

  onSearchClick(): void {
    console.log('Search clicked');
    // TODO: Implement search functionality
  }

  onNotificationClick(): void {
    console.log('Notifications clicked');
    // TODO: Implement notifications
  }

  onProfileClick(): void {
    // Navigate to profile page
    this.router.navigate(['/auth/profile']);
  }

  onLogout(): void {
    this.authService.logout();
  }
}