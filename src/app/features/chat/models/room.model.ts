import { User } from "../../../core/models/user.model";

export interface Room {
  id?: string;
  name?:string;
  participants: User[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomPaginateI {
  items: Room[];
  meta: Meta;
}

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}