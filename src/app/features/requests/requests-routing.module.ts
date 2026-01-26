import { Routes } from '@angular/router';
import { RequestDashboardComponent } from './components/request-dashboard/request-dashboard.component';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';

export const routes: Routes = [
  {
    path: 'requests',
    children: [
      { path: '', component: RequestDashboardComponent },
      { path: ':id', component: RequestDetailComponent }
    ]
  }
];