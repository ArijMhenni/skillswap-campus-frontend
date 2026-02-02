import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
          // /messages shows the list of rooms
  { path: ':roomId', component: ChatRoomComponent , },      // /messages/:roomId shows messages for that room
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
