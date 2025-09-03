import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { ProductSummary } from '../../models/product-summary.model';
import { ButtonComponent } from '../../button/button.component';
import { CartService } from '../../services/cart.service';

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

  constructor(
    private navigationService: NavigationService,
    private cartService: CartService
  ) {}

  addToCart() {
    if (this.product && this.product.colors && this.product.colors.length > 0) {
      const productWithColor = {
        ...this.product,
        selectedColor: this.product.colors[0],
      };
      this.cartService.addItem(productWithColor);
    } else {
      this.cartService.addItem(this.product);
    }
  }

  onViewProduct() {
    if (this.product.id) {
      this.navigationService.navigateToProduct(this.product.id);
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
