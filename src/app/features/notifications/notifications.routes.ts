import { Routes } from '@angular/router';
import { NotificationListComponent } from './components/notification-list/notification-list.component';

export const notificationsRoutes: Routes = [
  {
    path: '',
    component: NotificationListComponent,
  },
];
