import { Component, inject, signal, computed } from '@angular/core';
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
export class ProfileComponent {
  // Injection moderne
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  // Signals (au lieu de propriétés normales)
  currentUser = signal<User | null>(null);
  isEditing = signal(false);
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  
  offeredSkills = signal<string[]>([]);
  wantedSkills = signal<string[]>([]);
  newOfferedSkill = signal('');
  newWantedSkill = signal('');
  
  newAvatar = signal<string | undefined>(undefined);

  // Computed (valeurs dérivées)
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  });

  // Formulaire (reste classique)
  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    availability: ['', [Validators.maxLength(500)]]
  });

  // Constructor: charger immédiatement
  constructor() {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          availability: user.availability || ''
        });
        this.offeredSkills.set(user.offeredSkills || []);
        this.wantedSkills.set(user.wantedSkills || []);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage.set('Failed to load profile');
      }
    });
  }

  toggleEdit(): void {
    this.isEditing.update(v => !v);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.newAvatar.set(undefined);
    
    if (!this.isEditing()) {
      const user = this.currentUser();
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          availability: user.availability || ''
        });
        this.offeredSkills.set(user.offeredSkills || []);
        this.wantedSkills.set(user.wantedSkills || []);
      }
    }
  }

  onAvatarChange(base64: string): void {
    this.newAvatar.set(base64);
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const updateData: any = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
    };

    const currentOfferedSkills = this.offeredSkills();
    const currentWantedSkills = this.wantedSkills();
    
    if (currentOfferedSkills.length > 0) {
      updateData.offeredSkills = currentOfferedSkills;
    }
    
    if (currentWantedSkills.length > 0) {
      updateData.wantedSkills = currentWantedSkills;
    }
    
    if (this.profileForm.value.availability) {
      updateData.availability = this.profileForm.value.availability;
    }

    const currentNewAvatar = this.newAvatar();
    if (currentNewAvatar !== undefined) {
      updateData.avatar = currentNewAvatar === '' ? null : currentNewAvatar;
      console.log('✅ Avatar field included in payload');
    } else {
      console.log('✅ Avatar field NOT included - keeping existing avatar');
    }

    console.log('📤 Sending update data:', {
      ...updateData,
      avatar: updateData.avatar ? 'HAS_VALUE' : 'NOT_SET'
    });

    this.authService.updateProfile(updateData).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.isLoading.set(false);
        this.isEditing.set(false);
        this.successMessage.set('Profile updated successfully!');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to update profile. Please try again.');
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  addOfferedSkill(): void {
    const skill = this.newOfferedSkill().trim();
    const currentSkills = this.offeredSkills();
    if (skill && !currentSkills.includes(skill)) {
      this.offeredSkills.set([...currentSkills, skill]);
      this.newOfferedSkill.set('');
    }
  }

  removeOfferedSkill(skill: string): void {
    const currentSkills = this.offeredSkills();
    this.offeredSkills.set(currentSkills.filter(s => s !== skill));
  }

  onOfferedSkillKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addOfferedSkill();
    }
  }

  addWantedSkill(): void {
    const skill = this.newWantedSkill().trim();
    const currentSkills = this.wantedSkills();
    if (skill && !currentSkills.includes(skill)) {
      this.wantedSkills.set([...currentSkills, skill]);
      this.newWantedSkill.set('');
    }
  }

  removeWantedSkill(skill: string): void {
    const currentSkills = this.wantedSkills();
    this.wantedSkills.set(currentSkills.filter(s => s !== skill));
  }

  onWantedSkillKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addWantedSkill();
    }
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }
}