import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { Request, RequestStatus } from '../../models/request.model';
import { RequestCardComponent } from '../request-card/request-card.component';

@Component({
  selector: 'app-request-dashboard',
  standalone: true,
  imports: [CommonModule, RequestCardComponent],
  templateUrl: './request-dashboard.component.html',
  styleUrl: './request-dashboard.component.css'
})
export class RequestDashboardComponent {
  private requestService = inject(RequestService);
  private router = inject(Router);

  // Signals
  requests = signal<Request[]>([]);
  activeTab = signal<'sent' | 'received'>('sent');
  selectedStatus = signal<RequestStatus | 'ALL'>('ALL');
  isLoading = signal<boolean>(false);

  // Computed
  filteredRequests = computed(() => {
  const status = this.selectedStatus();
  const tab = this.activeTab();

  let baseList = this.requests();

  baseList = baseList.filter(req =>
    tab === 'sent'
      ? !!req.requester   // demandes envoyées
      : !!req.provider    // demandes reçues
  );

  if (status === 'ALL') {
    return baseList;
  }

  return baseList.filter(req => req.status === status);
});


  RequestStatus = RequestStatus;

  constructor() {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading.set(true);
    const role = this.activeTab() === 'sent' ? 'asRequester' : 'asProvider';
    
    this.requestService.getMyRequests({ role }).subscribe({
      next: (data) => {
         console.log('DATA FROM API:', data);
        this.requests.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des requêtes:', err);
        this.isLoading.set(false);
      }
    });
  }

  changeTab(tab: 'sent' | 'received'): void {
    this.activeTab.set(tab);
    this.loadRequests();
  }

  filterByStatus(status: RequestStatus | 'ALL'): void {
    this.selectedStatus.set(status);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/requests', id]);
  }

  onRequestUpdated(): void {
    this.loadRequests();
  }
}