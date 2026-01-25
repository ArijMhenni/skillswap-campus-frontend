import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Skill Swap Campus'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register - Skill Swap Campus'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'My Profile - Skill Swap Campus'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];