import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../services/skill.service';
import { AuthService } from '../../../core/services/auth.service';
import { Skill } from '../../../core/models/skill.model';
import { SkillCategory, SkillType } from '../../../core/models/skill.enum';
import { getUserDisplayName, getUserInitials } from '../../../core/models/user.model';
import { ERROR_MESSAGES } from '../../../core/constants/error-messages.constant';
import { SUCCESS_MESSAGES, CONFIRMATION_MESSAGES, SKILL_CATEGORY_LABELS, SKILL_TYPE_DETAIL_LABELS } from '../../../core/constants/app.constant';
import { CreateRequestModalComponent } from "../../requests/components/create-request-modal/create-request-modal.component";


@Component({
  selector: 'app-skill-detail',
  standalone: true,
  imports: [CommonModule, CreateRequestModalComponent],
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.css'],
})
export class SkillDetailComponent implements OnInit {
  skill = signal<Skill | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Expose SkillType enum to template
  SkillType = SkillType;

  // Computed property pour vérifier si l'utilisateur est propriétaire
  isOwner = computed(() => {
    const currentSkill = this.skill();
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentSkill || !currentUser) {
      return false;
    }
    
    // Vérifier si l'utilisateur connecté est le propriétaire de la compétence
    return currentSkill.user?.id === currentUser.id;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private skillService: SkillService,
    private authService: AuthService
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
    if (!currentSkill) return;

    // Vérifier que l'utilisateur est bien le propriétaire
    if (!this.isOwner()) {
      alert('Vous n\'êtes pas autorisé à modifier cette compétence.');
      return;
    }

    this.router.navigate(['/skills', currentSkill.id, 'edit']);
  }

  deleteSkill(): void {
    const currentSkill = this.skill();
    if (!currentSkill) return;

    // Vérifier que l'utilisateur est bien le propriétaire
    if (!this.isOwner()) {
      alert('Vous n\'êtes pas autorisé à supprimer cette compétence.');
      return;
    }

    const confirmed = confirm(CONFIRMATION_MESSAGES.SKILL.DELETE(currentSkill.title));

    if (confirmed) {
      this.loading.set(true);
      this.skillService.deleteSkill(currentSkill.id).subscribe({
        next: () => {
          alert(SUCCESS_MESSAGES.SKILL.DELETED);
          this.router.navigate(['/skills']);
        },
        error: (err) => {
          this.loading.set(false);
          const errorMessage = err.error?.message || ERROR_MESSAGES.SKILL.DELETE_ERROR;
          alert(errorMessage);
          console.error('Error deleting skill:', err);
        },
      });
    }
  }

  requestSkill(): void {
    this.openRequestModal();
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
    return SKILL_TYPE_DETAIL_LABELS[type];
  }

  getTypeBadgeClass(type: SkillType): string {
    return type === SkillType.OFFERED ? 'badge-offering' : 'badge-seeking';
  }

  getUserName(): string {
    return this.skill()?.user ? getUserDisplayName(this.skill()!.user!) : '';
  }

  getUserInitials(): string {
    return this.skill()?.user ? getUserInitials(this.skill()!.user!) : '?';
  }

  getUserRating(): number {
    return this.skill()?.user?.rating || 0;
  }

  getUserReviewCount(): number {
    return this.skill()?.user?.reviewCount || 0;
  }

  goToUserProfile(userId: string): void {
    if (userId) {
      this.router.navigate(['/users', userId]);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  showModal = signal<boolean>(false);

  openRequestModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onRequestCreated(): void {
    alert('Demande envoyée avec succès!');
    this.showModal.set(false);
  }
}
