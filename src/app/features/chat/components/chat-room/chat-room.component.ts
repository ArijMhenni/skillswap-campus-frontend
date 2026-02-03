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
import { AuthService } from '../../../../core/services/auth.service';
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
  private authService = inject(AuthService);
  
  @Input() chatRoom!: Room;
  @ViewChild('messagesContainer') private messagesScroller!: ElementRef;

  messagesPaginate$!: Observable<MessagePaginateI>;
  chatMessage = new FormControl('', [Validators.required]);
  isSending = signal(false);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chatRoom']) {
      // Always leave the previous room when changing
      if (changes['chatRoom'].previousValue) {
        this.chatService.leaveRoom();
      }
      
      // Join new room and initialize messages
      if (this.chatRoom) {
        this.chatService.joinRoom(this.chatRoom);
        this.initializeMessages();
      }
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
    const messageContent = this.chatMessage.value;
    
    const message: Message = {
      id: '',
      content: messageContent,
      room: this.chatRoom,
      sender: {} as User,
      createdAt: new Date(),
    };

    this.chatService.sendMessage(message);
    this.chatMessage.reset();
    
    // Reset sending state after a short delay to prevent rapid clicks
    setTimeout(() => {
      this.isSending.set(false);
    }, 100);
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

  getOtherParticipant(): User | null {
    if (!this.chatRoom || !this.chatRoom.participants || this.chatRoom.participants.length === 0) {
      return null;
    }
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return this.chatRoom.participants[0];
    }
    // Find the participant that is not the current user
    const otherParticipant = this.chatRoom.participants.find(p => p.id !== currentUser.id);
    return otherParticipant || this.chatRoom.participants[0];
  }
}

