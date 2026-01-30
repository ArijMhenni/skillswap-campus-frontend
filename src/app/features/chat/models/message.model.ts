import { User } from "../../../core/models/user.model";
import { Room, Meta } from "./room.model";

export interface Message {
  id: string;
  content: string;
  sender: User;
  room: Room;
  createdAt: Date;
}

export interface MessagePaginateI {
  items: Message[];
  meta: Meta;
}