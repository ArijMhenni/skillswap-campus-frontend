import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class RequestDashboardComponent implements OnInit {
  private requestService = inject(RequestService);

  // Signals
  requests = signal<Request[]>([]);
  activeTab = signal<'sent' | 'received'>('sent');
  selectedStatus = signal<RequestStatus | 'ALL'>('ALL');
  isLoading = signal<boolean>(false);

  // Computed
  filteredRequests = computed(() => {
    const allRequests = this.requests();
    const status = this.selectedStatus();
    
    if (status === 'ALL') return allRequests;
    return allRequests.filter(req => req.status === status);
  });

  RequestStatus = RequestStatus;

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading.set(true);
    const role = this.activeTab() === 'sent' ? 'asRequester' : 'asProvider';
    
    this.requestService.getMyRequests({ role }).subscribe({
      next: (data) => {
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

  onRequestUpdated(): void {
    this.loadRequests();
  }
}