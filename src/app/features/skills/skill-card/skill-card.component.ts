import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Skill } from '../../../core/models/skill.model';
import { SkillCategory, SkillType } from '../../../core/models/skill.enum';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.css'],
})
export class SkillCardComponent {
  @Input() skill!: Skill;
  @Input() compact = false;

  constructor(private router: Router) {}

  viewDetails(): void {
    this.router.navigate(['/skills', this.skill.id]);
  }

  getCategoryLabel(category: SkillCategory): string {
    const labels: Record<SkillCategory, string> = {
      [SkillCategory.TECH]: 'Technologie',
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

  getTypeLabel(type: SkillType): string {
    return type === SkillType.OFFERED ? 'Proposée' : 'Recherchée';
  }

  getTypeBadgeClass(type: SkillType): string {
    return type === SkillType.OFFERED ? 'badge-offered' : 'badge-wanted';
  }

  truncateDescription(description: string, maxLength: number = 150): string {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  }
}
