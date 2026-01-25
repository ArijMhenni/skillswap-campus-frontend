import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/skills',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'skills',
    loadChildren: () => import('./features/skills/skills.routes').then(m => m.SKILLS_ROUTES),
    canActivate: [authGuard] 
  },
  {
    path: '**',
    redirectTo: '/skills'
  }
];