import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../../../services/chat.service';
import { Room } from '../../../models/room.model';
import { User } from '../../../../../core/models/user.model';
import { UsersService } from '../../../../users/services/users.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css'],
})
export class CreateRoomComponent implements OnInit, OnDestroy {
  roomForm: FormGroup;
  allUsers$!: Observable<User[]>;
  selectedUsers: User[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private usersService: UsersService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.allUsers$ = this.usersService.getAllUsers();
    console.log('USERS FROM API:', this.allUsers$);

    this.allUsers$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => (this.isLoading = false),
        error: () => {
          this.isLoading = false;
          console.error('Failed to load users');
        },
      });
  }

  selectUser(user: User): void {
    if (!this.selectedUsers.find((u) => u.id === user.id)) {
      this.selectedUsers.push(user);
    }
  }

  removeUser(user: User): void {
    this.selectedUsers = this.selectedUsers.filter(
      (u) => u.id !== user.id
    );
  }

  createRoom(): void {
    if (this.selectedUsers.length === 0) {
      this.snackbar.open('Select at least one user', 'Close', {
        duration: 3000,
      });
      return;
    }

    const roomPayload: Room = {
      name: 'test',
      participants: this.selectedUsers.map((user) => ({
        id: user.id,
      })) as any,
    };

    this.chatService.createRoom(roomPayload);

    this.router.navigate(['/messages']);
  }

  cancel(): void {
    this.router.navigate(['/messages']);
  }
}
