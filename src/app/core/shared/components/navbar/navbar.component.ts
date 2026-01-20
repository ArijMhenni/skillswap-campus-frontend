import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  notificationCount = 3;

  onSearchClick(): void {
    console.log('Search clicked');
    // TODO: Implement search functionality
  }

  onNotificationClick(): void {
    console.log('Notifications clicked');
    // TODO: Implement notifications
  }

  onProfileClick(): void {
    console.log('Profile clicked');
    // TODO: Implement profile menu
  }
}
