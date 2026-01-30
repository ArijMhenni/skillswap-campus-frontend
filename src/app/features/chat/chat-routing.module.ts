import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageListComponent } from './components/message-list/message-list.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

const routes: Routes = [
  { path: '', component: MessageListComponent },         // /messages shows the list of rooms
  { path: ':roomId', component: ChatRoomComponent },      // /messages/:roomId shows messages for that room
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
