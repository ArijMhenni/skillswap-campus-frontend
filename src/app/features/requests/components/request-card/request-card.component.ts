import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Request, RequestStatus } from '../../models/request.model';
import { StatusColorPipe } from '../../pipes/status-color.pipe';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusColorPipe],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.css'
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

  acceptRequest(): void {
    if (confirm('Accepter cette demande ?')) {
      this.updateStatus(RequestStatus.ACCEPTED);
    }
  }

  rejectRequest(): void {
    if (confirm('Rejeter cette demande ?')) {
      this.updateStatus(RequestStatus.REJECTED);
    }
  }

  completeRequest(): void {
    if (confirm('Marquer comme complété ?')) {
      this.updateStatus(RequestStatus.COMPLETED);
    }
  }

  cancelRequest(): void {
    if (confirm('Annuler cette demande ?')) {
      this.updateStatus(RequestStatus.CANCELLED);
    }
  }

  private updateStatus(status: RequestStatus): void {
    this.requestService.updateStatus(this.request.id, status).subscribe({
      next: () => {
        this.requestUpdated.emit();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }
}