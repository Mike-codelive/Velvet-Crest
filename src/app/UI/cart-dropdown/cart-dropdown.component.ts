import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product-summary.model';
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
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  private cartSubscription!: Subscription;
  private openSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = [...items] as CartItem[];
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

  ngOnDestroy() {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
    if (this.openSubscription) this.openSubscription.unsubscribe();
  }

  getColorName(hex: string): string {
    const hexToNameMap: { [key: string]: string } = {
      '#000': 'Black',
      '#FFFFFF': 'White',
      '#FF0000': 'Red',
      '#00FF00': 'Lime',
      '#0000FF': 'Blue',
      '#FFB900': 'Yellow',
      '#FFA500': 'Orange',
      '#800080': 'Purple',
      '#808080': 'Gray',
      '#A52A2A': 'Brown',
      '#FFC0CB': 'Pink',
      '#00FFFF': 'Cyan',
      '#008000': 'Green',
      '#FFD700': 'Gold',
      '#F5F5DC': 'Beige',
    };
    return hexToNameMap[hex.toUpperCase()] || hex;
  }
}
