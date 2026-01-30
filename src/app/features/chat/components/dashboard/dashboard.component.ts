import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Room, RoomPaginateI } from '../../models/room.model';
import { PageI } from '../../models/page.interface';
import { User } from '../../../../core/models/user.model';
import { ChatRoomComponent } from '../chat-room/chat-room.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    ChatRoomComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  rooms$: Observable<RoomPaginateI>;
  selectedRoom: Room | null = null;
  user$: Observable<User>;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {
    this.rooms$ = this.chatService.getMyRooms();
    this.user$ = this.authService.getProfile();
  }

  ngOnInit() {
    this.loadRooms(10, 0);
  }

  ngAfterViewInit() {
    // Ensure rooms are loaded when component is fully initialized
    this.loadRooms(10, 0);
  }

  loadRooms(limit: number, page: number) {
    const pageRequest: PageI = {
      limit,
      page,
    };
    this.chatService.paginateRooms(pageRequest);
  }

  onSelectRoom(event: MatSelectionListChange) {
    const room = event.source.selectedOptions.selected[0]?.value as Room;
    if (!room) return;

    if (this.selectedRoom) {
      this.chatService.leaveRoom();
    }

    this.selectedRoom = room;
    this.chatService.joinRoom(room);
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.loadRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

  onCreateRoom() {
    this.router.navigate(['/create-room']);
  }
}
