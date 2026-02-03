import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CreateRatingDto, PendingRating } from '../../../../core/models/rating.model';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './rating-form.component.html',
  styleUrls: ['./rating-form.component.css'],
})
export class RatingFormComponent {
  @Input() pendingRating!: PendingRating;
  @Output() submitRating = new EventEmitter<CreateRatingDto>();
  @Output() cancel = new EventEmitter<void>();

  stars: number = 0;
  comment: string = '';
  isSubmitting: boolean = false;

  get ratingLabel(): string {
    const labels: { [key: number]: string } = {
      1: 'Mauvais',
      2: 'Passable',
      3: 'Bien',
      4: 'Tres bien',
      5: 'Excellent!',
    };
    return labels[this.stars] || '';
  }

  getInitials(): string {
    const { firstName, lastName } = this.pendingRating.user;
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  getFullName(): string {
    return `${this.pendingRating.user.firstName} ${this.pendingRating.user.lastName}`;
  }

  onStarsChange(value: number): void {
    this.stars = value;
  }

  onSubmit(): void {
    if (this.stars === 0) return;

    this.isSubmitting = true;

    const dto: CreateRatingDto = {
      requestId: this.pendingRating.requestId,
      stars: this.stars,
      comment: this.comment.trim() || undefined,
    };

    this.submitRating.emit(dto);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}