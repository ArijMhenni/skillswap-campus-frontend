import { Routes } from '@angular/router';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillDetailComponent } from './skill-detail/skill-detail.component';
import { SkillFormComponent } from './skill-form/skill-form.component';

export const SKILLS_ROUTES: Routes = [
  {
    path: '',
    component: SkillListComponent,
  },
  {
    path: 'new',
    component: SkillFormComponent,
  },
  {
    path: ':id',
    component: SkillDetailComponent,
  },
  {
    path: ':id/edit',
    component: SkillFormComponent,
  },
];
