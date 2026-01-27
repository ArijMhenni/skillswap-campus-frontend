import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './core/shared/components/navbar/navbar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SkillSwap Campus';
  currentUrl = '';

  constructor(private router: Router) {
    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });
  }

  shouldShowNavbar(): boolean {
    // Liste des routes où la navbar ne doit PAS apparaître
    const hideNavbarRoutes = [
      '/auth/login', 
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password'
    ];
    return !hideNavbarRoutes.includes(this.currentUrl);
  }
}