import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-create-request-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-request-modal.component.html',
  styleUrl: './create-request-modal.component.css'
})
export class CreateRequestModalComponent {
  @Input({ required: true }) skillId!: string;
  @Input({ required: true }) skillTitle!: string;
  @Output() requestCreated = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  private requestService = inject(RequestService);

  message = signal<string>('');
  isSubmitting = signal<boolean>(false);

  submitRequest(): void {
    if (!this.message().trim()) {
      alert('Veuillez entrer un message');
      return;
    }

    this.isSubmitting.set(true);

    this.requestService.createRequest({
      skillId: this.skillId,
      message: this.message()
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.requestCreated.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isSubmitting.set(false);
        alert('Erreur lors de l\'envoi de la demande');
      }
    });
  }

  closeModal(): void {
    this.modalClosed.emit();
  }
}