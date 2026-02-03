import { Component, input, output, signal, computed } from '@angular/core';
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
  hasBeenRemoved = signal(false); // ← NOUVEAU: track si supprimé

  sizeClasses = computed(() => {
    switch (this.size()) {
      case 'small': return 'w-12 h-12 text-sm';
      case 'medium': return 'w-24 h-24 text-2xl';
      case 'large': return 'w-32 h-32 text-4xl';
    }
  });

  
  displayUrl = computed(() => {
   
    if (this.hasBeenRemoved()) {
      return null;
    }
    
    return this.previewUrl() || this.currentAvatar();
  });

 onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Veuillez sélectionner une image');
      return;
    }
    
   
    const maxSize = 10 * 1024 * 1024; // 10MB au lieu de 5MB
    if (file.size > maxSize) {
      this.errorMessage.set('L\'image doit faire moins de 10MB');
      return;
    }
    
    this.errorMessage.set('');
    this.isUploading.set(true);
    this.hasBeenRemoved.set(false); // Reset si on upload une nouvelle image
    
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result as string;
      
      console.log('📷 Image loaded, size:', (base64.length / 1024).toFixed(2), 'KB');
      
     
      this.previewUrl.set(base64);
      
      this.avatarChange.emit(base64);
      
      this.isUploading.set(false);
    };
    
    reader.onerror = () => {
      console.error('❌ Erreur lecture fichier');
      this.errorMessage.set('Échec de la lecture du fichier');
      this.isUploading.set(false);
    };
    
    reader.readAsDataURL(file);
  }
  
  
  removeAvatar(): void {
    console.log('🗑️ Removing avatar');
    
    
    this.hasBeenRemoved.set(true);
    this.previewUrl.set(null);
    this.avatarChange.emit('');
    
    console.log('✅ Avatar removal signal sent to parent');
  }
}