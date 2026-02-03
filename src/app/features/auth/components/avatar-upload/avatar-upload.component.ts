import { Component, input, output, signal , computed} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.css'
})
export class AvatarUploadComponent {
 
  currentAvatar = input<string | null>(null);
  userInitials = input<string>('?');
  size = input<'small' | 'medium' | 'large'>('medium');
 

 avatarChange = output<string>();
  
  
  isUploading = signal(false);
  previewUrl = signal<string | null>(null);
  errorMessage = signal('');


 
  sizeClasses = computed(() => {
    switch (this.size()) {
      case 'small': return 'w-12 h-12 text-sm';
      case 'medium': return 'w-24 h-24 text-2xl';
      case 'large': return 'w-32 h-32 text-4xl';
    }
  });
  
  
  displayUrl = computed(() => {
    return this.previewUrl() || this.currentAvatar();
  });

 
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    // Validation
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      this.errorMessage.set('Image must be less than 5MB');
      return;
    }
    
    this.errorMessage.set('');
    this.isUploading.set(true);
    
    // Convertir en Base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      
      // Mettre à jour le preview local
      this.previewUrl.set(base64);
      
      
      this.avatarChange.emit(base64);
      
      this.isUploading.set(false);
    };
    
    reader.onerror = () => {
      this.errorMessage.set('Failed to read file');
      this.isUploading.set(false);
    };
    
    reader.readAsDataURL(file);
  }
  
  removeAvatar(): void {
    this.previewUrl.set(null);
    this.avatarChange.emit(''); 
  }
}