import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductSummary, CartItem } from '../models/product-summary.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private isCartOpenSubject = new BehaviorSubject<boolean>(false);
  isCartOpen$ = this.isCartOpenSubject.asObservable();

  private readonly STORAGE_KEY = 'velvetCrestCart';

  constructor() {
    const savedItems = localStorage.getItem(this.STORAGE_KEY);
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems) as CartItem[];
      this.cartItemsSubject.next(parsedItems);
    }
  }

  private calculateFinalPrice(
    basePrice: number,
    isSubscribed: boolean,
    giftWrap: boolean
  ): number {
    let price = basePrice;

    if (isSubscribed) {
      price *= 0.9;
    }

    if (giftWrap) {
      price += 900;
    }

    return Math.round(price);
  }

  addItem(
    product: ProductSummary,
    quantity: number,
    isSubscribed: boolean = false,
    giftWrap: boolean = false,
    selectedColor?: string,
    subscriptionPlan?: string
  ) {
    if (!product || !product.id) {
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const finalPrice = this.calculateFinalPrice(
      product.price,
      isSubscribed,
      giftWrap
    );

    console.log('CartService.addItem called with qty:', quantity);

    const existingItemIndex = currentItems.findIndex(
      (item) => item.id === product.id && item.selectedColor === selectedColor
    );

    if (existingItemIndex > -1) {
      console.log('Updating existing item');
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: (updatedItems[existingItemIndex].quantity || 1) + quantity,
        isSubscribed,
        giftWrap,
        subscriptionPlan: isSubscribed
          ? subscriptionPlan
          : updatedItems[existingItemIndex].subscriptionPlan,
        price: finalPrice,
      };
      this.cartItemsSubject.next(updatedItems);
    } else {
      console.log('Pushing new item');
      const cartItem: CartItem = {
        ...product,
        price: finalPrice,
        quantity,
        selectedColor,
        isSubscribed,
        giftWrap,
        subscriptionPlan: isSubscribed ? subscriptionPlan : undefined,
      };
      this.cartItemsSubject.next([...currentItems, cartItem]);
    }

    this.saveToLocalStorage();
    this.openCart();
  }

  removeItem(id: string, selectedColor?: string) {
    if (!id) {
      console.error('Invalid ID for removal:', id);
      return;
    }
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(
      (item) => !(item.id === id && item.selectedColor === selectedColor)
    );
    this.cartItemsSubject.next(updatedItems);
    this.saveToLocalStorage();
  }

  incrementQuantity(id: string, selectedColor?: string) {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(
      (item) => item.id === id && item.selectedColor === selectedColor
    );
    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      const item = updatedItems[itemIndex];
      updatedItems[itemIndex] = {
        ...item,
        quantity: (item.quantity || 1) + 1,
        price: this.calculateFinalPrice(
          item.price,
          !!item.isSubscribed,
          !!item.giftWrap
        ),
      };
      this.cartItemsSubject.next(updatedItems);
      this.saveToLocalStorage();
    }
  }

  decrementQuantity(id: string, selectedColor?: string) {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(
      (item) => item.id === id && item.selectedColor === selectedColor
    );
    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      const item = updatedItems[itemIndex];
      const currentQuantity = item.quantity || 1;
      if (currentQuantity > 1) {
        updatedItems[itemIndex] = {
          ...item,
          quantity: currentQuantity - 1,
          price: this.calculateFinalPrice(
            item.price,
            !!item.isSubscribed,
            !!item.giftWrap
          ),
        };
      } else {
        updatedItems.splice(itemIndex, 1);
      }
      this.cartItemsSubject.next(updatedItems);
      this.saveToLocalStorage();
    }
  }

  getCartTotal(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }

  getCartCount(): number {
    const items = this.cartItemsSubject.value;
    return items.reduce((count, item) => count + (item.quantity || 1), 0);
  }

  openCart() {
    this.isCartOpenSubject.next(true);
  }

  closeCart() {
    this.isCartOpenSubject.next(false);
  }

  toggleCart() {
    const newState = !this.isCartOpenSubject.value;
    this.isCartOpenSubject.next(newState);
  }

  private saveToLocalStorage() {
    const items = this.cartItemsSubject.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}
