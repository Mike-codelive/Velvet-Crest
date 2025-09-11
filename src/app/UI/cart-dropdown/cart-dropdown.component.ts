import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product-summary.model';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../button/button.component';
import { getColorName } from '../../../utils/get-color-name';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.css'],
})
export class CartDropdownComponent implements OnInit, OnDestroy {
  isOpen = false;
  cartItems: CartItem[] = [];
  subtotal = 0;

  private cartSubscription: Subscription | null = null;
  private openSubscription: Subscription | null = null;

  constructor(
    private cartService: CartService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = [...items];
      this.subtotal = this.calculateSubtotal();
    });

    this.openSubscription = this.cartService.isCartOpen$.subscribe((open) => {
      this.isOpen = open;
    });
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * (item.quantity ?? 1),
      0
    );
  }

  removeItem(id: string, selectedColor?: string) {
    this.cartService.removeItem(id, selectedColor);
  }

  incrementQuantity(id: string, selectedColor?: string) {
    this.cartService.incrementQuantity(id, selectedColor);
  }

  decrementQuantity(id: string, selectedColor?: string) {
    this.cartService.decrementQuantity(id, selectedColor);
  }

  onCheckout() {
    this.navigationService.navigateToRoute(['/checkout']);
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

  getSubscriptionDisplay(plan: string): string {
    switch (plan) {
      case '1_week':
        return 'Every 1 Week';
      case '2_weeks':
        return 'Every 2 Weeks';
      case '4_weeks':
        return 'Every 4 Weeks';
      case '8_weeks':
        return 'Every 8 Weeks';
      default:
        return 'Unknown Frequency';
    }
  }

  getColorName(hex?: string): string {
    return hex ? getColorName(hex) : 'Custom Color';
  }

  ngOnDestroy() {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
    if (this.openSubscription) this.openSubscription.unsubscribe();
  }
}
