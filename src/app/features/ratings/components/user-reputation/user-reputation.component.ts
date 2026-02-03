import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-user-reputation',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './user-reputation.component.html',
  styleUrls: ['./user-reputation.component.css'],
})
export class UserReputationComponent {
  @Input() averageRating: number = 0;
  @Input() totalRatings: number = 0;
  @Input() ratingDistribution: { [key: number]: number } = {};
  @Input() showDistribution: boolean = true;

  get isTopRated(): boolean {
    return this.averageRating >= 4.5 && this.totalRatings >= 5;
  }

  get distributionBars(): {
    star: number;
    count: number;
    percentage: number;
  }[] {
    const total = Object.values(this.ratingDistribution).reduce(
      (a, b) => a + b,
      0
    );
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: this.ratingDistribution[star] || 0,
      percentage:
        total > 0
          ? ((this.ratingDistribution[star] || 0) / total) * 100
          : 0,
    }));
  }
}