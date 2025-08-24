import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductSummary } from '../../models/product-summary.model';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.css'],
})
export class CartDropdownComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  cartItems: ProductSummary[] = [];
  subtotal: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.subtotal = this.calculateSubtotal();
    });
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  removeItem(id: string) {
    this.cartService.removeItem(id);
  }

  onCheckout() {
    this.router.navigate(['/checkout']);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
