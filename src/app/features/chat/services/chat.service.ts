import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomSocket } from '../socket/custom-socket';
import { Room, RoomPaginateI } from '../models/room.model';
import { PageI } from '../models/page.interface';
import { Message, MessagePaginateI } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private messagesSubject = new BehaviorSubject<MessagePaginateI>({
    items: [],
    meta: { currentPage: 0, itemCount: 0, itemsPerPage: 10, totalItems: 0, totalPages: 0 },
  });

  constructor(private socket: CustomSocket, private snackbar: MatSnackBar) {
    // Listen for messages events from socket and push to subject
    this.socket.fromEvent<MessagePaginateI>('messages').subscribe((messages) => {
      this.messagesSubject.next(messages);
    });

    // Listen for new messages and append to current messages
    this.socket.fromEvent<Message>('messageAdded').subscribe((message) => {
      const currentMessages = this.messagesSubject.value;
      if (!currentMessages.items.some((m) => m.id === message.id)) {
        currentMessages.items.push(message);
        this.messagesSubject.next({ ...currentMessages });
      }
    });
  }

  // ------------------- Rooms -------------------
  getMyRooms(): Observable<RoomPaginateI> {
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  createRoom(room: Partial<Room>) {
    this.socket.emit('createRoom', room);
    console.log('Room created successfully');
  }

  paginateRooms(page: PageI) {
    this.socket.emit('paginateRoom', page);
  }

  joinRoom(room: Room) {
    this.socket.emit('joindRoom', room);
  }

  leaveRoom() {
    this.socket.emit('leaveRoom');
    // Reset messages when leaving a room
    this.messagesSubject.next({
      items: [],
      meta: { currentPage: 0, itemCount: 0, itemsPerPage: 10, totalItems: 0, totalPages: 0 },
    });
  }

  // ------------------- Messages -------------------
  getAddedMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('messageAdded');
  }

  getMessages(): Observable<MessagePaginateI> {
    return this.messagesSubject.asObservable();
  }

  sendMessage(message: Message) {
    const { id, ...msgData } = message;
    this.socket.emit('addMessage', msgData);
  }
}
