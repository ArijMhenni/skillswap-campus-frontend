import { Component, OnInit, signal } from '@angular/core';
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
  
  // Ownership status from route guard - set by the guard
  isOwner = signal(false);

  // Expose SkillType enum to template
  SkillType = SkillType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private skillService: SkillService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get ownership status from route data (set by guard)
    const isOwnerFromRoute = this.route.snapshot.data['isOwner'];
    if (isOwnerFromRoute !== undefined) {
      this.isOwner.set(isOwnerFromRoute);
    }

    // Check if skill was pre-loaded by guard
    const preLoadedSkill = this.route.snapshot.data['skill'];
    if (preLoadedSkill) {
      this.skill.set(preLoadedSkill);
    } else {
      // Fallback: load skill if not pre-loaded
      const skillId = this.route.snapshot.paramMap.get('id');
      if (skillId) {
        this.loadSkill(skillId);
      } else {
        this.error.set(ERROR_MESSAGES.SKILL.INVALID_ID);
      }
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

    // Guard will handle authorization check
    this.router.navigate(['/skills', currentSkill.id, 'edit']);
  }

  deleteSkill(): void {
    const currentSkill = this.skill();
    if (!currentSkill) return;

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
    if (!currentSkill) {
    return;
  }
  const currentUser = this.authService.getCurrentUser();
  if (currentSkill.user?.id === currentUser?.id) {
    alert('Vous ne pouvez pas proposer votre aide sur votre propre demande');
    return;
  } 
  
  this.showModal.set(true);   
    
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
