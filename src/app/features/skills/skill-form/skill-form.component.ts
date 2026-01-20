import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../services/skill.service';
import {
  CreateSkillDto,
  UpdateSkillDto,
  Skill,
} from '../../../core/models/skill.model';
import { SkillCategory, SkillType } from '../../../core/models/skill.enum';
import { ERROR_MESSAGES } from '../../../core/constants/error-messages.constant';
import { VALIDATION_MESSAGES, SKILL_VALIDATION } from '../../../core/constants/validation-messages.constant';
import { SUCCESS_MESSAGES, SKILL_CATEGORY_LABELS, SKILL_TYPE_FORM_LABELS } from '../../../core/constants/app.constant';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.css'],
})
export class SkillFormComponent implements OnInit {
  skillForm: FormGroup;
  isEditMode = signal(false);
  skillId = signal<string | null>(null);
  loading = signal(false);
  submitting = signal(false);
  error = signal<string | null>(null);

  // Enums for template
  categories = Object.values(SkillCategory);
  types = Object.values(SkillType);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private skillService: SkillService
  ) {
    this.skillForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.skillId.set(id);
    this.isEditMode.set(!!id);

    if (this.isEditMode() && this.skillId()) {
      this.loadSkill(this.skillId()!);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(SKILL_VALIDATION.TITLE.MIN_LENGTH),
        Validators.maxLength(SKILL_VALIDATION.TITLE.MAX_LENGTH)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(SKILL_VALIDATION.DESCRIPTION.MIN_LENGTH),
        Validators.maxLength(SKILL_VALIDATION.DESCRIPTION.MAX_LENGTH)
      ]],
      category: ['', Validators.required],
      type: ['', Validators.required],
      estimatedTime: [
        1,
        [
          Validators.required,
          Validators.min(SKILL_VALIDATION.ESTIMATED_TIME.MIN),
          Validators.max(SKILL_VALIDATION.ESTIMATED_TIME.MAX)
        ],
      ],
    });
  }

  loadSkill(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.skillService.getSkillById(id).subscribe({
      next: (skill: Skill) => {
        this.skillForm.patchValue({
          title: skill.title,
          description: skill.description,
          category: skill.category,
          type: skill.type,
          estimatedTime: skill.estimatedTime,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(ERROR_MESSAGES.SKILL.LOAD_ERROR);
        console.error('Error loading skill:', err);
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.skillId()) {
      this.updateSkill();
    } else {
      this.createSkill();
    }
  }

  createSkill(): void {
    const skillData: CreateSkillDto = this.skillForm.value;

    this.skillService.createSkill(skillData).subscribe({
      next: (createdSkill: Skill) => {
        alert(SUCCESS_MESSAGES.SKILL.CREATED);
        this.router.navigate(['/skills', createdSkill.id]);
      },
      error: (err) => {
        this.error.set(ERROR_MESSAGES.SKILL.CREATE_ERROR);
        console.error('Error creating skill:', err);
        this.submitting.set(false);
      },
    });
  }

  updateSkill(): void {
    const skillData: UpdateSkillDto = this.skillForm.value;

    this.skillService.updateSkill(this.skillId()!, skillData).subscribe({
      next: (updatedSkill: Skill) => {
        alert(SUCCESS_MESSAGES.SKILL.UPDATED);
        this.router.navigate(['/skills', updatedSkill.id]);
      },
      error: (err) => {
        this.error.set(ERROR_MESSAGES.SKILL.UPDATE_ERROR);
        console.error('Error updating skill:', err);
        this.submitting.set(false);
      },
    });
  }

  cancel(): void {
    if (this.isEditMode() && this.skillId()) {
      this.router.navigate(['/skills', this.skillId()]);
    } else {
      this.router.navigate(['/skills']);
    }
  }

  getCategoryLabel(category: SkillCategory): string {
    return SKILL_CATEGORY_LABELS[category];
  }

  getTypeLabel(type: SkillType): string {
    return SKILL_TYPE_FORM_LABELS[type];
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.skillForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.skillForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return VALIDATION_MESSAGES.REQUIRED;
    if (field.errors['minlength'])
      return VALIDATION_MESSAGES.MIN_LENGTH(field.errors['minlength'].requiredLength);
    if (field.errors['maxlength'])
      return VALIDATION_MESSAGES.MAX_LENGTH(field.errors['maxlength'].requiredLength);
    if (field.errors['min'])
      return VALIDATION_MESSAGES.MIN_VALUE(field.errors['min'].min);
    if (field.errors['max'])
      return VALIDATION_MESSAGES.MAX_VALUE(field.errors['max'].max);

    return VALIDATION_MESSAGES.INVALID;
  }

  selectType(type: SkillType): void {
    this.skillForm.patchValue({ type });
  }
}
