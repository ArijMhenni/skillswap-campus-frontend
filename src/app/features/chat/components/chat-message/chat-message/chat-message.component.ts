import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Message } from '../../../models/message.model';
import { User } from '../../../../../core/models/user.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  standalone: true,
  imports: [AsyncPipe, DatePipe,CommonModule]
})
export class ChatMessageComponent implements OnInit {

  @Input() message!: Message; // ⚡ add definite assignment
  user$!: Observable<User>;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user$ = this.authService.getProfile(); // get current logged-in user
  }

  // optional helper to check if the message is sent by the logged-in user
  isMine(senderId: string | undefined): boolean {
    let mine = false;
    this.user$.subscribe(user => {
      mine = user.id === senderId;
    }).unsubscribe();
    return mine;
  }
}
