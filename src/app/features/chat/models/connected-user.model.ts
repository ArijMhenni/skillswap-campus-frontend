import { User } from '../../../core/models/user.model';

export interface ConnectedUser {
  id?: string;
  socketId: string;
  user: User;
  createdAt?: Date;
}
