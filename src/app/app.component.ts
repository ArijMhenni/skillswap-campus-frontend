import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-content {
      flex: 1;
      background-color: #f9fafb;
    }

    .app-header nav a:hover,
    .app-header nav a.active {
      background-color: rgba(255,255,255,0.2);
    }

    .app-content {
      flex: 1;
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'SkillSwap Campus';
}
