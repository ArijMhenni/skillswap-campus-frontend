import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  private resetToken = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer le token depuis l'URL
    this.resetToken = this.route.snapshot.queryParamMap.get('token') || '';
    
    if (!this.resetToken) {
      this.errorMessage = 'Token de réinitialisation manquant ou invalide';
    }

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Si les champs sont vides, ne pas valider
    if (!newPassword || !confirmPassword) {
      return null;
    }

    // Comparer les mots de passe
    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.resetToken) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const newPassword = this.resetPasswordForm.value.newPassword;

      this.authService.resetPassword(this.resetToken, newPassword).subscribe({
        next: (response) => {
          this.successMessage = 'Mot de passe réinitialisé avec succès! Redirection...';
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        }
      });
    }
  }
}