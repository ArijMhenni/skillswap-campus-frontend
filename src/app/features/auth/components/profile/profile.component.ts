import { Component, inject, signal, computed, effect } from '@angular/core';
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

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);


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

 
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  });

  
  hasChanges = computed(() => {
    const user = this.currentUser();
    if (!user) return false;
    
    return (
      this.profileForm.value.firstName !== user.firstName ||
      this.profileForm.value.lastName !== user.lastName ||
      this.profileForm.value.availability !== (user.availability || '') ||
      JSON.stringify(this.offeredSkills()) !== JSON.stringify(user.offeredSkills || []) ||
      JSON.stringify(this.wantedSkills()) !== JSON.stringify(user.wantedSkills || []) ||
      this.newAvatar() !== undefined
    );
  });


  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    availability: ['', [Validators.maxLength(500)]]
  });

  
  constructor() {
    // Charger le profil dès la création du component
    this.loadProfile();

    
    effect(() => {
      const user = this.currentUser();
      if (user) {
        console.log('👤 User loaded:', user.email);
      }
    });
  }

  
  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        // Mettre à jour le signal
        this.currentUser.set(user);
        
        // Remplir le formulaire
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          availability: user.availability || ''
        });
        
        // Mettre à jour les compétences
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
    
    this.isEditing.update(value => !value);
    
    
    this.successMessage.set('');
    this.errorMessage.set('');
    this.newAvatar.set(undefined);
    
    // Si on annule l'édition, restaurer les valeurs
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

    // Gérer l'avatar
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
        
        // Effacer le message après 3 secondes
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