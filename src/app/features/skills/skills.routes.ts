import { Routes } from '@angular/router';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillDetailComponent } from './skill-detail/skill-detail.component';
import { SkillFormComponent } from './skill-form/skill-form.component';
import { authGuard } from '../../core/guards/auth.guard';
import { skillOwnerGuard } from '../../core/guards/resource-owner.guard';

export const SKILLS_ROUTES: Routes = [
  {
    path: '',
    component: SkillListComponent,
  },
  {
    path: 'new',
    component: SkillFormComponent,
    canActivate: [authGuard],
  },
  {
    path: ':id',
    component: SkillDetailComponent,
    canActivate: [skillOwnerGuard], // Loads skill and sets ownership data
  },
  {
    path: ':id/edit',
    component: SkillFormComponent,
    canActivate: [authGuard, skillOwnerGuard], // Protects edit route - only owners allowed
  },
];
