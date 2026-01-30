import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { SkillModerationComponent } from './components/skill-moderation/skill-moderation.component';
import { ReportsManagementComponent } from './components/reports-management/reports-management.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'users',
        component: UserManagementComponent,
      },
      {
        path: 'skills',
        component: SkillModerationComponent,
      },
      {
        path: 'reports',
        component: ReportsManagementComponent,
      },
    ],
  },
];
