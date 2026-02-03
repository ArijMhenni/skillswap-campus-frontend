import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Request, RequestStatus } from '../../models/request.model';
import { RequestService } from '../../services/request.service';

// Constants for status mappings to avoid recreating objects on each call
const STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: 'Pending',
  [RequestStatus.ACCEPTED]: 'Accepted',
  [RequestStatus.REJECTED]: 'Rejected',
  [RequestStatus.COMPLETED]: 'Completed',
  [RequestStatus.CANCELLED]: 'Cancelled',
};

const STATUS_CLASSES: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: 'bg-amber-100 text-amber-700',
  [RequestStatus.ACCEPTED]: 'bg-emerald-100 text-emerald-700',
  [RequestStatus.REJECTED]: 'bg-red-100 text-red-700',
  [RequestStatus.COMPLETED]: 'bg-blue-100 text-blue-700',
  [RequestStatus.CANCELLED]: 'bg-gray-100 text-gray-700',
};

const STATUS_ICONS: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>',
  [RequestStatus.ACCEPTED]: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
  [RequestStatus.REJECTED]: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
  [RequestStatus.COMPLETED]: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
  [RequestStatus.CANCELLED]: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
};

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestCardComponent {
  @Input({ required: true }) request!: Request;
  @Input({ required: true }) viewAs!: 'sent' | 'received';
  @Output() requestUpdated = new EventEmitter<void>();

  private requestService = inject(RequestService);

  RequestStatus = RequestStatus;

  get otherUser() {
    return this.viewAs === 'sent' ? this.request.provider : this.request.requester;
  }

  get canAccept(): boolean {
    return this.viewAs === 'received' && this.request.status === RequestStatus.PENDING;
  }

  get canReject(): boolean {
    return this.viewAs === 'received' && this.request.status === RequestStatus.PENDING;
  }

  get canComplete(): boolean {
    return this.request.status === RequestStatus.ACCEPTED;
  }

  get canCancel(): boolean {
    return this.viewAs === 'sent' && this.request.status === RequestStatus.PENDING;
  }

  getInitials(): string {
    const user = this.otherUser;
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  getStatusLabel(): string {
    return STATUS_LABELS[this.request.status];
  }

  getStatusClass(): string {
    return STATUS_CLASSES[this.request.status];
  }

  getStatusIcon(): string {
    return STATUS_ICONS[this.request.status];
  }

  acceptRequest(): void {
    if (confirm('Are you sure you want to accept this request?')) {
      this.updateStatus(RequestStatus.ACCEPTED);
    }
  }

  rejectRequest(): void {
    if (confirm('Are you sure you want to reject this request?')) {
      this.updateStatus(RequestStatus.REJECTED);
    }
  }

  completeRequest(): void {
    if (confirm('Are you sure you want to mark this request as completed?')) {
      this.updateStatus(RequestStatus.COMPLETED);
    }
  }

  cancelRequest(): void {
    if (confirm('Are you sure you want to cancel this request?')) {
      this.updateStatus(RequestStatus.CANCELLED);
    }
  }

  private updateStatus(status: RequestStatus): void {
    this.requestService.updateStatus(this.request.id, status).subscribe({
      next: () => {
        this.requestUpdated.emit();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Error updating status';
        alert(errorMsg);
      }
    });
  }
}
