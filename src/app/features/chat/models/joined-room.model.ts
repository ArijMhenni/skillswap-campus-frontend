import { Room } from './room.model';
import { User } from '../../../core/models/user.model';

export interface JoinedRoom {
  id?: string;
  socketId: string;
  user: User;
  room: Room;
  createdAt?: Date;
}
