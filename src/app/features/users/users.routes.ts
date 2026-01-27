import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const USERS_ROUTES: Routes = [
  {
    path: ':id',
    component: UserProfileComponent,
  },
];
