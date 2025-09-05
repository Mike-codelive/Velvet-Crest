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
      this.cartItemsSubject.next(
        parsedItems.map((item) => ({
          ...item,
          adjustedPrice: item.adjustedPrice || item.price,
        }))
      );
    }
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
    const existingItemIndex = currentItems.findIndex(
      (item) => item.id === product.id && item.selectedColor === selectedColor
    );

    const basePrice = product.price;
    let adjustedPrice = basePrice;
    if (isSubscribed) adjustedPrice *= 0.9;
    if (giftWrap) adjustedPrice += 900;

    if (existingItemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: (updatedItems[existingItemIndex].quantity || 1) + quantity,
        isSubscribed,
        giftWrap,
        subscriptionPlan: isSubscribed
          ? subscriptionPlan
          : updatedItems[existingItemIndex].subscriptionPlan,
        adjustedPrice:
          ((updatedItems[existingItemIndex].adjustedPrice || basePrice) *
            ((updatedItems[existingItemIndex].quantity || 1) + quantity)) /
            updatedItems[existingItemIndex].quantity! +
          (giftWrap ? 900 : 0) -
          (isSubscribed ? basePrice * 0.1 * quantity : 0),
      };
      this.cartItemsSubject.next(updatedItems);
    } else {
      const cartItem: CartItem = {
        ...product,
        quantity,
        selectedColor,
        isSubscribed,
        giftWrap,
        subscriptionPlan: isSubscribed ? subscriptionPlan : undefined,
        adjustedPrice: adjustedPrice * quantity,
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
        adjustedPrice:
          (item.adjustedPrice || item.price) +
          (item.giftWrap ? 900 : 0) -
          (item.isSubscribed ? item.price * 0.1 : 0),
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
          adjustedPrice:
            (item.adjustedPrice || item.price) -
            (item.giftWrap ? 900 : 0) +
            (item.isSubscribed ? item.price * 0.1 : 0),
        };
      } else {
        updatedItems.splice(itemIndex, 1);
      }
      this.cartItemsSubject.next(updatedItems);
      this.saveToLocalStorage();
    }
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
