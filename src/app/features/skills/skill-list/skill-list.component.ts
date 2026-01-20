import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SkillCardComponent } from '../skill-card/skill-card.component';
import { SkillService } from '../services/skill.service';
import {
  Skill,
  SkillFilters,
  PaginatedResponse,
} from '../../../core/models/skill.model';
import { SkillCategory, SkillType } from '../../../core/models/skill.enum';
import { ERROR_MESSAGES } from '../../../core/constants/error-messages.constant';
import { PAGINATION_DEFAULTS, SKILL_CATEGORY_LABELS, SKILL_TYPE_LABELS } from '../../../core/constants/app.constant';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SkillCardComponent],
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css'],
})
export class SkillListComponent implements OnInit {
  skills = signal<Skill[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filters
  filters = signal<SkillFilters>({
    page: PAGINATION_DEFAULTS.PAGE,
    limit: PAGINATION_DEFAULTS.LIMIT,
  });

  // Pagination
  pagination = signal<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>({
    page: PAGINATION_DEFAULTS.PAGE,
    limit: PAGINATION_DEFAULTS.LIMIT,
    total: 0,
    totalPages: 0,
  });

  // Enums for template
  categories = Object.values(SkillCategory);
  types = Object.values(SkillType);

  constructor(private router: Router, private skillService: SkillService) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading.set(true);
    this.error.set(null);

    this.skillService.getSkills(this.filters()).subscribe({
      next: (response: PaginatedResponse<Skill>) => {
        this.skills.set(response.data);
        this.pagination.set({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(ERROR_MESSAGES.SKILL.LOAD_ERROR);
        console.error('Error loading skills:', err);
        this.loading.set(false);
      },
    });
  }

  onSearchChange(search: string): void {
    const currentFilters = this.filters();
    this.filters.set({ ...currentFilters, search, page: 1 });
    this.loadSkills();
  }

  onCategoryChange(category: string): void {
    const currentFilters = this.filters();
    this.filters.set({
      ...currentFilters,
      category: category ? (category as SkillCategory) : undefined,
      page: 1,
    });
    this.loadSkills();
  }

  onTypeChange(type: string): void {
    const currentFilters = this.filters();
    this.filters.set({
      ...currentFilters,
      type: type ? (type as SkillType) : undefined,
      page: 1,
    });
    this.loadSkills();
  }

  clearFilters(): void {
    this.filters.set({
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
    });
    this.loadSkills();
  }

  goToPage(page: number): void {
    const currentFilters = this.filters();
    this.filters.set({ ...currentFilters, page });
    this.loadSkills();
  }

  viewSkillDetail(id: string): void {
    this.router.navigate(['/skills', id]);
  }

  createSkill(): void {
    this.router.navigate(['/skills/new']);
  }

  getCategoryLabel(category: SkillCategory): string {
    return SKILL_CATEGORY_LABELS[category];
  }

  getTypeLabel(type: SkillType): string {
    return SKILL_TYPE_LABELS[type];
  }

  getTypeBadgeClass(type: SkillType): string {
    return type === SkillType.OFFERED ? 'badge-offering' : 'badge-seeking';
  }
}
