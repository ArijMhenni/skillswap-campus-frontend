import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { Skill, PaginatedResponse } from '../../../../core/models/skill.model';
import { SkillService } from '../../../../core/services/skill.service';
import { SkillCategory } from '../../../../core/models/skill.enum';

@Component({
  selector: 'app-skill-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './skill-moderation.component.html',
  styleUrls: ['./skill-moderation.component.css'],
})
export class SkillModerationComponent implements OnInit {
  private adminService = inject(AdminService);
  private skillService = inject(SkillService);

  skills: Skill[] = [];
  loading = true;
  error: string | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalItems = 0;

  categoryFilter: SkillCategory | '' = '';
  searchQuery = '';

  showDeleteModal = false;
  selectedSkill: Skill | null = null;
  deleteLoading = false;

  ngOnInit() {
    this.loadSkills();
  }

  loadSkills() {
    this.loading = true;
    this.error = null;

    this.skillService
      .getSkills({
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.searchQuery || undefined,
        category: this.categoryFilter || undefined,
      })
      .subscribe({
        next: (response: PaginatedResponse<Skill>) => {
          this.skills = response.data;
          this.totalPages = response.pagination.totalPages;
          this.totalItems = response.pagination.total;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des skills';
          this.loading = false;
          console.error('Error loading skills:', err);
        },
      });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadSkills();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadSkills();
  }

  openDeleteModal(skill: Skill) {
    this.selectedSkill = skill;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedSkill = null;
  }

  confirmDelete() {
    if (!this.selectedSkill) return;

    this.deleteLoading = true;

    this.adminService.deleteSkill(this.selectedSkill.id).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.closeDeleteModal();
        this.loadSkills();
      },
      error: (err) => {
        this.deleteLoading = false;
        console.error('Error deleting skill:', err);
        alert('Erreur lors de la suppression de la skill');
      },
    });
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      TECH: 'Tech',
      LANGUAGES: 'Langues',
      ART: 'Art',
      MUSIC: 'Musique',
      COOKING: 'Cuisine',
      ACADEMICS: 'Académique',
      SPORTS: 'Sports',
      OTHER: 'Autre',
    };
    return labels[category] || category;
  }

  getTypeLabel(type: string): string {
    return type === 'OFFER' ? 'Offre' : 'Demande';
  }

  getUserInitials(user: any): string {
    if (!user) return '?';
    const firstInitial = user.firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = user.lastName?.charAt(0).toUpperCase() || '';
    return (
      firstInitial + lastInitial || user.email?.charAt(0).toUpperCase() || '?'
    );
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
