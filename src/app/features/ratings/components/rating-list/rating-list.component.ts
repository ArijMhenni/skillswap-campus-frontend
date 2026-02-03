import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Rating } from '../../../../core/models/rating.model';

@Component({
  selector: 'app-rating-list',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.css'],
})
export class RatingListComponent {
  @Input() ratings: Rating[] = [];
  @Input() type: 'received' | 'given' = 'received';
  @Input() emptyMessage: string = 'Aucun avis trouve';

  getOtherUser(
    rating: Rating
  ): { firstName: string; lastName: string; profilePicture?: string } {
    return this.type === 'received' ? rating.rater : rating.ratedUser;
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  getFullName(user: { firstName: string; lastName: string }): string {
    return `${user.firstName} ${user.lastName}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}