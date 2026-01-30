import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { MessageListComponent } from './components/message-list/message-list.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CreateRoomComponent } from './components/create-room/create-room/create-room.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChatRoutingModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    MessageListComponent, 
    ChatRoomComponent,
    CreateRoomComponent
  ],
})
export class ChatModule {}