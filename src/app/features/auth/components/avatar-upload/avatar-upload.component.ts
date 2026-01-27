import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from '../../../../core/services/image-upload.service';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.css'
})
export class AvatarUploadComponent {
  @Input() currentAvatar: string | null = null;
  @Input() userInitials: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() avatarChange = new EventEmitter<string>();

  previewUrl = signal<string | null>(null);
  isUploading = signal<boolean>(false);
  errorMessage = signal<string>('');
  isRemoved = signal<boolean>(false);

  constructor(private imageUploadService: ImageUploadService) {}

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.errorMessage.set('');
    this.isRemoved.set(false);

    this.isUploading.set(true);

    try {
      //  Le service retourne { valid, base64?, error? }
      const result = await this.imageUploadService.processImage(file);
      
      if (!result.valid || !result.base64) {
        this.errorMessage.set(result.error || 'Failed to process image');
        return;
      }

      this.previewUrl.set(result.base64);
      this.avatarChange.emit(result.base64);
    } catch (error) {
      this.errorMessage.set('Failed to process image. Please try again.');
    } finally {
      this.isUploading.set(false);
    }
  }

  removeAvatar(): void {
    this.previewUrl.set(null);
    this.isRemoved.set(true);
    this.avatarChange.emit('');
  }

  getAvatarUrl(): string | null {
    if (this.isRemoved()) return null;
    return this.previewUrl() || this.currentAvatar;
  }

  getSizeClasses(): string {
    switch (this.size) {
      case 'small': return 'w-12 h-12 text-lg';
      case 'medium': return 'w-20 h-20 text-2xl';
      case 'large': return 'w-24 h-24 text-3xl';
    }
  }
}