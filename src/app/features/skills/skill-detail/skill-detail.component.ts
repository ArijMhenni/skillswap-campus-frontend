import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../services/skill.service';
import { Skill } from '../../../core/models/skill.model';
import { SkillCategory, SkillType } from '../../../core/models/skill.enum';
import { ERROR_MESSAGES } from '../../../core/constants/error-messages.constant';
import { SUCCESS_MESSAGES, CONFIRMATION_MESSAGES, SKILL_CATEGORY_LABELS, SKILL_TYPE_DETAIL_LABELS, TEMP_USER_ID } from '../../../core/constants/app.constant';

@Component({
  selector: 'app-skill-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.css'],
})
export class SkillDetailComponent implements OnInit {
  skill = signal<Skill | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Expose SkillType enum to template
  SkillType = SkillType;

  // TODO: Remplacer par l'ID de l'utilisateur connecté depuis le service d'authentification
  currentUserId = signal(TEMP_USER_ID);

  // Computed property pour vérifier si l'utilisateur est propriétaire
  isOwner = computed(() => this.skill()?.userId === this.currentUserId());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private skillService: SkillService
  ) {}

  ngOnInit(): void {
    const skillId = this.route.snapshot.paramMap.get('id');
    if (skillId) {
      this.loadSkill(skillId);
    } else {
      this.error.set(ERROR_MESSAGES.SKILL.INVALID_ID);
    }
  }

  loadSkill(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.skillService.getSkillById(id).subscribe({
      next: (skill: Skill) => {
        this.skill.set(skill);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(ERROR_MESSAGES.SKILL.LOAD_ERROR);
        console.error('Error loading skill:', err);
        this.loading.set(false);
      },
    });
  }

  editSkill(): void {
    const currentSkill = this.skill();
    if (currentSkill) {
      this.router.navigate(['/skills', currentSkill.id, 'edit']);
    }
  }

  deleteSkill(): void {
    const currentSkill = this.skill();
    if (!currentSkill) return;

    const confirmed = confirm(CONFIRMATION_MESSAGES.SKILL.DELETE(currentSkill.title));

    if (confirmed) {
      this.skillService.deleteSkill(currentSkill.id).subscribe({
        next: () => {
          alert(SUCCESS_MESSAGES.SKILL.DELETED);
          this.router.navigate(['/skills']);
        },
        error: (err) => {
          alert(ERROR_MESSAGES.SKILL.DELETE_ERROR);
          console.error('Error deleting skill:', err);
        },
      });
    }
  }

  requestSkill(): void {
    const currentSkill = this.skill();
    // TODO: Implémenter la logique de demande de compétence
    alert(
      `Demande de compétence "${currentSkill?.title}" envoyée à ${currentSkill?.user?.firstName}`
    );
  }

  offerHelp(): void {
    const currentSkill = this.skill();
    // TODO: Implémenter la logique d'offre d'aide
    alert(
      `Offre d'aide pour "${currentSkill?.title}" envoyée à ${currentSkill?.user?.firstName}`
    );
  }

  goBack(): void {
    this.router.navigate(['/skills']);
  }

  getCategoryLabel(category: SkillCategory): string {
    return SKILL_CATEGORY_LABELS[category];
  }

  getTypeLabel(type: SkillType): string {
    return SKILL_TYPE_DETAIL_LABELS[type];
  }

  getTypeBadgeClass(type: SkillType): string {
    return type === SkillType.OFFERED ? 'badge-offered' : 'badge-wanted';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
