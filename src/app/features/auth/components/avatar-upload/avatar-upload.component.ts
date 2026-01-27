import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from '../../../../core/services/image-upload.service';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.css']
})
export class AvatarUploadComponent {
  private imageService = inject(ImageUploadService);

  // Inputs (modern signals)
  currentAvatar = input<string | null>(null);
  userInitials = input<string>('U');
  size = input<'small' | 'medium' | 'large'>('medium');

  // Outputs (modern approach)
  avatarChange = output<string>();

  // Local state with signals
  isUploading = signal(false);
  errorMessage = signal<string>('');
  previewUrl = signal<string | null>(null);

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    // Reset error
    this.errorMessage.set('');

    // Validate image
    const validation = this.imageService.validateImage(file);
    if (!validation.valid) {
      this.errorMessage.set(validation.error || 'Invalid image');
      return;
    }

    try {
      this.isUploading.set(true);

      // Resize and convert to base64
      const base64 = await this.imageService.resizeImage(file, 400, 400);
      
      // Set preview
      this.previewUrl.set(base64);

      // Emit to parent
      this.avatarChange.emit(base64);

    } catch (error) {
      console.error('Error uploading image:', error);
      this.errorMessage.set('Failed to upload image. Please try again.');
    } finally {
      this.isUploading.set(false);
    }
  }

  removeAvatar(): void {
    this.previewUrl.set(null);
    this.avatarChange.emit('');
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('avatar-input') as HTMLInputElement;
    fileInput?.click();
  }

  getDisplayAvatar(): string | null {
    return this.previewUrl() || this.currentAvatar() || null;
  }

  getSizeClass(): string {
    const sizeMap = {
      small: 'w-16 h-16',
      medium: 'w-24 h-24',
      large: 'w-32 h-32'
    };
    return sizeMap[this.size()];
  }
}