import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  signal,
  inject,
  effect,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Message, MessagePaginateI } from '../../models/message.model';
import { Room } from '../../models/room.model';
import { User } from '../../../../core/models/user.model';
import { ChatService } from '../../services/chat.service';
import { ChatMessageComponent } from '../chat-message/chat-message/chat-message.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnChanges, OnDestroy, AfterViewInit {
  private chatService = inject(ChatService);
  
  @Input() chatRoom!: Room;
  @ViewChild('messagesContainer') private messagesScroller!: ElementRef;

  messagesPaginate$!: Observable<MessagePaginateI>;
  chatMessage = new FormControl('', [Validators.required]);
  isSending = signal(false);

  constructor() {
    effect(() => {
      if (this.chatRoom) {
        this.initializeMessages();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chatRoom']?.previousValue) {
      this.chatService.leaveRoom();
    }
    if (this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
      this.initializeMessages();
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    if (this.chatRoom) {
      this.chatService.leaveRoom();
    }
  }

  private initializeMessages() {
    this.messagesPaginate$ = this.chatService.getMessages().pipe(
      map((messagePaginate) => {
        const sortedItems = messagePaginate.items.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        messagePaginate.items = sortedItems;
        return messagePaginate;
      }),
      tap(() => this.scrollToBottom())
    );
  }

  sendMessage() {
    if (!this.chatMessage.valid || !this.chatRoom || this.isSending() || !this.chatMessage.value) return;

    this.isSending.set(true);
    const message: Message = {
      id: '',
      content: this.chatMessage.value,
      room: this.chatRoom,
      sender: {} as User,
      createdAt: new Date(),
    };

    this.chatService.sendMessage(message);
    this.chatMessage.reset();
    this.isSending.set(false);
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesScroller) {
        setTimeout(() => {
          this.messagesScroller.nativeElement.scrollTop =
            this.messagesScroller.nativeElement.scrollHeight;
        }, 0);
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}

