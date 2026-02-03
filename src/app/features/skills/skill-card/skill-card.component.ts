import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Skill } from '../../../core/models/skill.model';
import { SkillCategory, SkillType } from '../../../core/models/skill.enum';
import { getUserDisplayName, getUserInitials } from '../../../core/models/user.model';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.css'],
})
export class SkillCardComponent {
  private router = inject(Router);
  
  @Input() skill!: Skill;

  viewDetails(): void {
    this.router.navigate(['/skills', this.skill.id]);
  }

  getCategoryLabel(category: SkillCategory): string {
    const labels: Record<SkillCategory, string> = {
      [SkillCategory.TECH]: 'Tech',
      [SkillCategory.LANGUAGES]: 'Langues',
      [SkillCategory.ART]: 'Art',
      [SkillCategory.MUSIC]: 'Musique',
      [SkillCategory.SPORTS]: 'Sports',
      [SkillCategory.COOKING]: 'Cuisine',
      [SkillCategory.OTHER]: 'Autre',
      [SkillCategory.ACADEMICS]: 'Académique',
    };
    return labels[category];
  }

  getCategoryClass(category: SkillCategory): string {
    const classes: Record<SkillCategory, string> = {
      [SkillCategory.TECH]: 'category-tech',
      [SkillCategory.LANGUAGES]: 'category-languages',
      [SkillCategory.ART]: 'category-art',
      [SkillCategory.MUSIC]: 'category-music',
      [SkillCategory.SPORTS]: 'category-sports',
      [SkillCategory.COOKING]: 'category-cooking',
      [SkillCategory.OTHER]: 'category-other',
      [SkillCategory.ACADEMICS]: 'category-academics',
    };
    return classes[category];
  }

  getTypeLabel(type: SkillType): string {
    return type === SkillType.OFFERED ? 'Offre' : 'Recherche';
  }

  getTypeBadgeClass(type: SkillType): string {
    return type === SkillType.OFFERED ? 'badge-offering' : 'badge-seeking';
  }

  getUserName(): string {
    return this.skill.user ? getUserDisplayName(this.skill.user) : '';
  }

  getUserInitials(): string {
    return this.skill.user ? getUserInitials(this.skill.user) : '?';
  }

  getUserRating(): number {
    return this.skill.user?.rating || 0;
  }

  getUserReviewCount(): number {
    return this.skill.user?.reviewCount || 0;
  }

  getEstimatedTimeLabel(): string {
    const hours = this.skill.estimatedTime;
    return hours === 1 ? `${hours} heure/semaine` : `${hours}-${hours + 1} heures/semaine`;
  }
}
