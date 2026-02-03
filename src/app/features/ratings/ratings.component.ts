import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RatingService } from './services/rating.service';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { UserReputationComponent } from './components/user-reputation/user-reputation.component';
import { RatingListComponent } from './components/rating-list/rating-list.component';
import { RatingFormComponent } from './components/rating-form/rating-form.component';
import {
  Rating,
  PendingRating,
  UserReputationSummary,
  CreateRatingDto,
} from '../../core/models/rating.model';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StarRatingComponent,
    UserReputationComponent,
    RatingListComponent,
    RatingFormComponent,
  ],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css'],
})
export class RatingsComponent implements OnInit {
  activeTab = signal<'received' | 'given'>('received');
  receivedRatings = signal<Rating[]>([]);
  givenRatings = signal<Rating[]>([]);
  pendingRatings = signal<PendingRating[]>([]);
  reputation = signal<UserReputationSummary | null>(null);
  loading = signal(true);

  selectedPendingRating = signal<PendingRating | null>(null);

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.ratingService.getMyReputation().subscribe({
      next: (rep) => this.reputation.set(rep),
      error: (err) => console.error('Error loading reputation:', err),
    });

    this.ratingService.getReceivedRatings().subscribe({
      next: (ratings) => {
        this.receivedRatings.set(ratings);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading received ratings:', err);
        this.loading.set(false);
      },
    });

    this.ratingService.getGivenRatings().subscribe({
      next: (ratings) => this.givenRatings.set(ratings),
      error: (err) => console.error('Error loading given ratings:', err),
    });

    this.ratingService.getPendingRatings().subscribe({
      next: (pending) => this.pendingRatings.set(pending),
      error: (err) => console.error('Error loading pending ratings:', err),
    });
  }

  setTab(tab: 'received' | 'given'): void {
    this.activeTab.set(tab);
  }

  get currentRatings(): Rating[] {
    return this.activeTab() === 'received'
      ? this.receivedRatings()
      : this.givenRatings();
  }

  openRatingForm(pending: PendingRating): void {
    this.selectedPendingRating.set(pending);
  }

  closeRatingForm(): void {
    this.selectedPendingRating.set(null);
  }

  submitRating(dto: CreateRatingDto): void {
    this.ratingService.createRating(dto).subscribe({
      next: () => {
        this.closeRatingForm();
        this.loadData(); // Recharger les donnees
      },
      error: (err) => {
        console.error('Error submitting rating:', err);
      },
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  }

  getFullName(user: { firstName: string; lastName: string }): string {
    return `${user.firstName} ${user.lastName}`;
  }
}