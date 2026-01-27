import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { AvatarUploadComponent } from '../avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AvatarUploadComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  
  offeredSkills: string[] = [];
  wantedSkills: string[] = [];
  newOfferedSkill = '';
  newWantedSkill = '';
  
  newAvatar: string | undefined = undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      availability: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          availability: user.availability || ''
        });
        this.offeredSkills = user.offeredSkills || [];
        this.wantedSkills = user.wantedSkills || [];
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile';
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
    this.errorMessage = '';
    this.newAvatar = undefined;
    
    if (!this.isEditing) {
      this.profileForm.patchValue({
        firstName: this.currentUser?.firstName,
        lastName: this.currentUser?.lastName,
        availability: this.currentUser?.availability || ''
      });
      this.offeredSkills = this.currentUser?.offeredSkills || [];
      this.wantedSkills = this.currentUser?.wantedSkills || [];
    }
  }

  onAvatarChange(base64: string): void {
    this.newAvatar = base64;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updateData: any = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      offeredSkills: this.offeredSkills.length > 0 ? this.offeredSkills : undefined,
      wantedSkills: this.wantedSkills.length > 0 ? this.wantedSkills : undefined,
      availability: this.profileForm.value.availability || undefined,
    };

    
    if (this.newAvatar !== undefined) {
      updateData.avatar = this.newAvatar === '' ? null : this.newAvatar;
      console.log('Adding avatar to payload:', updateData.avatar);
    } else {
      console.log('newAvatar is undefined, NOT adding to payload');
    }

    

    this.authService.updateProfile(updateData).subscribe({
      next: (user) => {
        
        this.currentUser = user;
        this.isLoading = false;
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

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

  getUserInitials(): string {
    if (!this.currentUser) return '?';
    const first = this.currentUser.firstName?.charAt(0) || '';
    const last = this.currentUser.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  // Getters pour la validation des champs
  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }
}