import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductSummary } from '../../models/product-summary.model';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.css'],
})
export class CartDropdownComponent implements OnDestroy {
  isOpen = false;
  cartItems: ProductSummary[] = [];
  subtotal: number = 0;
  private cartSubscription!: Subscription;
  private openSubscription!: Subscription;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = [...items];
      this.subtotal = this.calculateSubtotal();
      console.log('Cart items updated:', items);
    });

    this.openSubscription = this.cartService.isCartOpen$.subscribe((open) => {
      this.isOpen = open;
      console.log('Cart open state received in dropdown:', open);
    });
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }

  removeItem(id: string) {
    this.cartService.removeItem(id);
  }

  incrementQuantity(id: string) {
    this.cartService.incrementQuantity(id);
  }

  decrementQuantity(id: string) {
    this.cartService.decrementQuantity(id);
  }

  onCheckout() {
    this.router.navigate(['/checkout']);
    this.cartService.closeCart();
  }

  onClose() {
    this.cartService.closeCart();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.cartService.closeCart();
    }
  }

  ngOnDestroy() {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
    if (this.openSubscription) this.openSubscription.unsubscribe();
  }
}
