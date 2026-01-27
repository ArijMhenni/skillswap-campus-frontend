import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { AvatarUploadComponent } from '../avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AvatarUploadComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: User | null = null;
  profileForm!: FormGroup;
  
  isEditing = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Skills management
  newOfferedSkill = '';
  newWantedSkill = '';
  offeredSkills: string[] = [];
  wantedSkills: string[] = [];

  // Avatar management
  newAvatar: string | undefined = undefined;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Initialize skills arrays
    this.offeredSkills = this.currentUser.offeredSkills || [];
    this.wantedSkills = this.currentUser.wantedSkills || [];

    // Initialize form
    this.profileForm = this.fb.group({
      firstName: [this.currentUser.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.currentUser.lastName, [Validators.required, Validators.minLength(2)]],
      email: [{ value: this.currentUser.email, disabled: true }],
      availability: [this.currentUser.availability || '']
    });
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get availability() {
    return this.profileForm.get('availability');
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
    this.errorMessage = '';
    this.newAvatar = undefined;
    
    if (!this.isEditing) {
      // Reset form if canceling
      this.profileForm.patchValue({
        firstName: this.currentUser?.firstName,
        lastName: this.currentUser?.lastName,
        availability: this.currentUser?.availability || ''
      });
      this.offeredSkills = this.currentUser?.offeredSkills || [];
      this.wantedSkills = this.currentUser?.wantedSkills || [];
    }
  }

  // Avatar Management
  onAvatarChange(base64: string): void {
    this.newAvatar = base64 || '';
  }

  // Offered Skills Management
  addOfferedSkill(): void {
    const skill = this.newOfferedSkill.trim();
    if (skill && !this.offeredSkills.includes(skill)) {
      this.offeredSkills.push(skill);
      this.newOfferedSkill = '';
    }
  }

  removeOfferedSkill(skill: string): void {
    this.offeredSkills = this.offeredSkills.filter(s => s !== skill);
  }

  onOfferedSkillKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addOfferedSkill();
    }
  }

  // Wanted Skills Management
  addWantedSkill(): void {
    const skill = this.newWantedSkill.trim();
    if (skill && !this.wantedSkills.includes(skill)) {
      this.wantedSkills.push(skill);
      this.newWantedSkill = '';
    }
  }

  removeWantedSkill(skill: string): void {
    this.wantedSkills = this.wantedSkills.filter(s => s !== skill);
  }

  onWantedSkillKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addWantedSkill();
    }
  }

  onSubmit(): void {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.successMessage = '';
  this.errorMessage = '';

  const updateData = {
    firstName: this.profileForm.value.firstName,
    lastName: this.profileForm.value.lastName,
    offeredSkills: this.offeredSkills.length > 0 ? this.offeredSkills : undefined,
    wantedSkills: this.wantedSkills.length > 0 ? this.wantedSkills : undefined,
    availability: this.profileForm.value.availability || undefined,
    avatar: this.newAvatar === '' ? undefined : this.newAvatar
  };

  this.authService.updateProfile(updateData).subscribe({
    next: (user) => {
      this.currentUser = user;
      this.isLoading = false;
      this.isEditing = false;
      this.newAvatar = undefined;
      this.successMessage = 'Profile updated successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
    }
  });
}

  getUserInitials(): string {
    if (!this.currentUser) return '?';
    const first = this.currentUser.firstName?.charAt(0).toUpperCase() || '';
    const last = this.currentUser.lastName?.charAt(0).toUpperCase() || '';
    return first + last || this.currentUser.email.charAt(0).toUpperCase();
  }

  onLogout(): void {
    this.authService.logout();
  }
}