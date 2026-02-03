import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
})
export class StarRatingComponent {
  @Input() value: number = 0;
  @Input() readonly: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showValue: boolean = false;
  @Output() valueChange = new EventEmitter<number>();

  hoverValue: number | null = null;
  stars = [1, 2, 3, 4, 5];

  get sizeInPx(): number {
    const sizes = { sm: 14, md: 20, lg: 28 };
    return sizes[this.size];
  }

  get displayValue(): number {
    return this.hoverValue !== null ? this.hoverValue : this.value;
  }

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.value = star;
      this.valueChange.emit(star);
    }
  }

  onMouseEnter(star: number): void {
    if (!this.readonly) {
      this.hoverValue = star;
    }
  }

  onMouseLeave(): void {
    this.hoverValue = null;
  }

  isFilled(star: number): boolean {
    return star <= this.displayValue;
  }
}