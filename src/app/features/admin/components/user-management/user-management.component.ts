import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { User } from '../../../../core/models/user.model';
import { PaginatedResponse } from '../../../../core/models/skill.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  Math = Math;

  private adminService = inject(AdminService);

  users: User[] = [];
  loading = true;
  error: string | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalItems = 0;

  searchQuery = '';

  showBanModal = false;
  selectedUser: User | null = null;
  banReason = '';
  banLoading = false;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.adminService
      .getUsers({
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.searchQuery || undefined,
      })
      .subscribe({
        next: (response: PaginatedResponse<User>) => {
          this.users = response.data;
          this.totalPages = response.pagination.totalPages;
          this.totalItems = response.pagination.total;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des utilisateurs';
          this.loading = false;
          console.error('Error loading users:', err);
        },
      });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  openBanModal(user: User) {
    this.selectedUser = user;
    this.banReason = '';
    this.showBanModal = true;
  }

  closeBanModal() {
    this.showBanModal = false;
    this.selectedUser = null;
    this.banReason = '';
  }

  confirmBan() {
    if (!this.selectedUser || !this.banReason.trim()) {
      return;
    }

    this.banLoading = true;

    this.adminService
      .banUser(this.selectedUser.id, { reason: this.banReason })
      .subscribe({
        next: () => {
          this.banLoading = false;
          this.closeBanModal();
          this.loadUsers();
        },
        error: (err) => {
          this.banLoading = false;
          console.error('Error banning user:', err);
          alert("Erreur lors du bannissement de l'utilisateur");
        },
      });
  }

  unbanUser(user: User) {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir débannir ${user.firstName} ${user.lastName} ?`,
      )
    ) {
      return;
    }

    this.adminService.unbanUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error unbanning user:', err);
        alert("Erreur lors du débannissement de l'utilisateur");
      },
    });
  }

  getUserInitials(user: User): string {
    const firstInitial = user.firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = user.lastName?.charAt(0).toUpperCase() || '';
    return firstInitial + lastInitial || user.email.charAt(0).toUpperCase();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
