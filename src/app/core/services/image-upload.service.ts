import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  
  
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate image file
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload a valid image (JPG, PNG, GIF, or WebP)' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'Image size must be less than 5MB' };
    }

    return { valid: true };
  }

  /**
   * Resize image before upload (optional but recommended)
   */
  async resizeImage(file: File, maxWidth: number = 400, maxHeight: number = 400): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with quality optimization
          const base64 = canvas.toDataURL('image/jpeg', 0.85);
          resolve(base64);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * ✅ Process image: validate + resize
   * All-in-one method for avatar upload
   */
  async processImage(file: File): Promise<{ valid: boolean; base64?: string; error?: string }> {
    // Validate first
    const validation = this.validateImage(file);
    if (!validation.valid) {
      return validation;
    }

    // Resize and convert
    try {
      const base64 = await this.resizeImage(file);
      return { valid: true, base64 };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Failed to process image' 
      };
    }
  }
}