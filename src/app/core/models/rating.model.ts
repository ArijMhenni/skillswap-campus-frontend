export interface Rating {
  id: string;
  requestId: string;
  raterId: string;
  rater: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  ratedUserId: string;
  ratedUser: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  skillTitle: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

export interface PendingRating {
  requestId: string;
  lessonCompletedId?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  skillTitle: string;
  completedAt: string;
}

export interface UserReputationSummary {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export interface CreateRatingDto {
  requestId: string;
  stars: number;
  comment?: string;
}