import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { authGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Connexion - Skill Swap Campus'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Inscription - Skill Swap Campus'
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Mot de passe oublié - Skill Swap Campus'
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Réinitialiser mot de passe - Skill Swap Campus'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'Mon Profil - Skill Swap Campus'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];