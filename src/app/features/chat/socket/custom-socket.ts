import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomSocket {
  private socket: Socket;

  constructor() {
    const token = localStorage.getItem('access_token');
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: token,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle connection errors
    this.socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('Error', (error: any) => {
      console.error('Socket error event:', error);
    });
  }

  emit(event: string, data?: any) {
    this.socket.emit(event, data);
  }

  fromEvent<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      const listener = (data: T) => subscriber.next(data);
      this.socket.on(event, listener);
      return () => this.socket.off(event, listener);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  connect() {
    this.socket.connect();
  }
}
