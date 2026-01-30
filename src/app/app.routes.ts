import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { RequestDashboardComponent } from './features/requests/components/request-dashboard/request-dashboard.component';
import { RequestDetailComponent } from './features/requests/components/request-detail/request-detail.component';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.routes').then((m) => m.homeRoutes),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'skills',
    loadChildren: () =>
      import('./features/skills/skills.routes').then((m) => m.SKILLS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'requests',
    children: [
      { path: '', component: RequestDashboardComponent },
      { path: ':id', component: RequestDetailComponent },
    ],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./features/notifications/notifications.routes').then(
        (m) => m.notificationsRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
