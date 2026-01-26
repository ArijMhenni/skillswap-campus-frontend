export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Request {
  id: string;
  skillId: string;
  skill?: {
    id: string;
    title: string;
    description: string;
    category: string;
    type: 'OFFER' | 'REQUEST';
  };
  requesterId: string;
  requester?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  providerId: string;
  provider?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: RequestStatus;
  message: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateRequestDto {
  skillId: string;
  message: string;
}

export interface UpdateStatusDto {
  status: RequestStatus;
}