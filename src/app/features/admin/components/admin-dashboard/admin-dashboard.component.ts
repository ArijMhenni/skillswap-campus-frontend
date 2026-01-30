import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { AdminStats } from '../../../../core/models/admin-stats.model';

interface StatCard {
  label: string;
  value: number;
  iconPath: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats: AdminStats | null = null;
  loading = true;
  error: string | null = null;

  statCards: StatCard[] = [];

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.loading = true;
    this.error = null;

    this.adminService.getStatistics().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.buildStatCards(stats);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des statistiques';
        this.loading = false;
        console.error('Error loading stats:', err);
      },
    });
  }

  private buildStatCards(stats: AdminStats) {
    this.statCards = [
      {
        label: 'Total Utilisateurs',
        value: stats.totalUsers,
        iconPath:
          'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        label: 'Utilisateurs Actifs',
        value: stats.activeUsers,
        iconPath:
          'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
      {
        label: 'Utilisateurs Bannis',
        value: stats.bannedUsers,
        iconPath:
          'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v4M12 16h.01',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      },
      {
        label: 'Skills Actives',
        value: stats.activeSkills,
        iconPath:
          'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
      },
      {
        label: 'Signalements en Attente',
        value: stats.pendingReports,
        iconPath:
          'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
      },
    ];
  }
}
