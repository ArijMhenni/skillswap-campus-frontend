import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SkillService } from '../../skills/services/skill.service';
import { User } from '../../../core/models/user.model';
import { Skill } from '../../../core/models/skill.model';
import { SkillType } from '../../../core/models/skill.enum';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user = signal<User | null>(null);
  userSkills = signal<Skill[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Expose SkillType enum to template
  SkillType = SkillType;

  // Computed properties
  offeredSkillsCount = computed(() => 
    this.userSkills().filter(s => s.type === SkillType.OFFERED).length
  );

  requestedSkillsCount = computed(() => 
    this.userSkills().filter(s => s.type === SkillType.WANTED).length
  );

  isOwnProfile = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    const profileUser = this.user();
    return currentUser && profileUser && currentUser.id === profileUser.id;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private skillService: SkillService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserProfile(userId);
      this.loadUserSkills(userId);
    } else {
      this.error.set('ID utilisateur invalide');
    }
  }

  loadUserProfile(userId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du profil utilisateur');
        console.error('Error loading user profile:', err);
        this.loading.set(false);
      },
    });
  }

  loadUserSkills(userId: string): void {
    this.skillService.getSkillsByUser(userId).subscribe({
      next: (skills: Skill[]) => {
        this.userSkills.set(skills);
      },
      error: (err) => {
        console.error('Error loading user skills:', err);
      },
    });
  }

  getUserInitials(): string {
    const currentUser = this.user();
    if (!currentUser) return '?';
    const first = currentUser.firstName?.charAt(0).toUpperCase() || '';
    const last = currentUser.lastName?.charAt(0).toUpperCase() || '';
    return first + last;
  }

  getUserFullName(): string {
    const currentUser = this.user();
    if (!currentUser) return '';
    return `${currentUser.firstName} ${currentUser.lastName}`;
  }

  goToSkillDetail(skillId: string): void {
    this.router.navigate(['/skills', skillId]);
  }

  goToEditProfile(): void {
    this.router.navigate(['/auth/profile']);
  }

  goBack(): void {
    window.history.back();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
