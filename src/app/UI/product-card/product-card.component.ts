import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductSummary } from '../../models/product-summary.model';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: ProductSummary;
  @Output() imageLoad = new EventEmitter<void>();
  @Output() imageError = new EventEmitter<void>();

  constructor(private router: Router) {}

  onViewProduct() {
    if (this.product.id) {
      this.router.navigate(['/product', this.product.id]).then(() => {
        window.scrollTo({ top: 0 });
      });
    } else {
      console.error('Product or product.id is undefined:', this.product);
    }
  }

  onImageLoad() {
    this.imageLoad.emit();
  }

  onImageError() {
    this.imageError.emit();
  }
}
