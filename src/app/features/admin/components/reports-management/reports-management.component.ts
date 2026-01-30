import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { Report, ResolveReportDto } from '../../../../core/models/report.model';
import { ReportStatus } from '../../../../core/models/report.enum';
import { PaginatedResponse } from '../../../../core/models/skill.model';

@Component({
  selector: 'app-reports-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports-management.component.html',
  styleUrls: ['./reports-management.component.css'],
})
export class ReportsManagementComponent implements OnInit {
  private adminService = inject(AdminService);

  reports: Report[] = [];
  loading = true;
  error: string | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalItems = 0;

  statusFilter: ReportStatus | '' = '';

  showResolveModal = false;
  selectedReport: Report | null = null;
  resolveStatus: ReportStatus = ReportStatus.RESOLVED;
  adminNotes = '';
  resolveLoading = false;

  ReportStatus = ReportStatus;

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.error = null;

    this.adminService
      .getReports({
        status: this.statusFilter || undefined,
        page: this.currentPage,
        limit: this.itemsPerPage,
      })
      .subscribe({
        next: (response: PaginatedResponse<Report>) => {
          this.reports = response.data;
          this.totalPages = response.pagination.totalPages;
          this.totalItems = response.pagination.total;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des signalements';
          this.loading = false;
          console.error('Error loading reports:', err);
        },
      });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadReports();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadReports();
  }

  openResolveModal(report: Report) {
    this.selectedReport = report;
    this.resolveStatus = ReportStatus.RESOLVED;
    this.adminNotes = '';
    this.showResolveModal = true;
  }

  closeResolveModal() {
    this.showResolveModal = false;
    this.selectedReport = null;
    this.adminNotes = '';
  }

  confirmResolve() {
    if (!this.selectedReport) return;

    this.resolveLoading = true;

    const dto: ResolveReportDto = {
      status: this.resolveStatus,
      adminNotes: this.adminNotes.trim() || undefined,
    };

    this.adminService.resolveReport(this.selectedReport.id, dto).subscribe({
      next: () => {
        this.resolveLoading = false;
        this.closeResolveModal();
        this.loadReports();
      },
      error: (err) => {
        this.resolveLoading = false;
        console.error('Error resolving report:', err);
        alert('Erreur lors de la résolution du signalement');
      },
    });
  }

  getStatusLabel(status: ReportStatus): string {
    const labels: Record<ReportStatus, string> = {
      [ReportStatus.PENDING]: 'En attente',
      [ReportStatus.RESOLVED]: 'Résolu',
      [ReportStatus.REJECTED]: 'Rejeté',
    };
    return labels[status];
  }

  getTargetTypeLabel(type: string): string {
    return type === 'USER' ? 'Utilisateur' : 'Skill';
  }

  getUserInitials(user: any): string {
    if (!user) return '?';
    const firstInitial = user.firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = user.lastName?.charAt(0).toUpperCase() || '';
    return (
      firstInitial + lastInitial || user.email?.charAt(0).toUpperCase() || '?'
    );
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
