import { Component, Input, inject, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Message } from '../../../models/message.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  standalone: true,
  imports: [DatePipe, CommonModule]
})
export class ChatMessageComponent {
  private authService = inject(AuthService);
  
  @Input() message!: Message;
  currentUserId = signal<string | null>(null);

  constructor() {
    // Get current user from auth service
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserId.set(currentUser.id);
    }
    
    // Also subscribe to profile in case getCurrentUser doesn't work
    this.authService.getProfile().subscribe({
      next: (user) => {
        if (user?.id) {
          this.currentUserId.set(user.id);
        }
      },
      error: (err) => console.error('Error fetching user profile:', err)
    });
  }

  get isOwnMessage(): boolean {
    const userId = this.currentUserId();
    const senderId = this.message?.sender?.id;
    return userId !== null && senderId !== undefined && userId === senderId;
  }
}
