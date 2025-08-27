import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductSummary } from '../models/product-summary.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<ProductSummary[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private isCartOpenSubject = new BehaviorSubject<boolean>(false);
  isCartOpen$ = this.isCartOpenSubject.asObservable();

  private readonly STORAGE_KEY = 'velvetCrestCart';

  constructor() {
    const savedItems = localStorage.getItem(this.STORAGE_KEY);
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems) as ProductSummary[];
      this.cartItemsSubject.next(parsedItems);
    }
  }

  addItem(product: ProductSummary) {
    if (!product || !product.id) {
      return;
    }
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: (updatedItems[existingItemIndex].quantity || 1) + 1,
      };
      this.cartItemsSubject.next(updatedItems);
    } else {
      this.cartItemsSubject.next([
        ...currentItems,
        { ...product, quantity: 1 },
      ]);
    }
    this.saveToLocalStorage();
    this.openCart();
  }

  removeItem(id: string) {
    if (!id) {
      console.error('Invalid ID for removal:', id);
      return;
    }
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter((item) => item.id !== id);
    this.cartItemsSubject.next(updatedItems);
    this.saveToLocalStorage();
  }

  incrementQuantity(id: string) {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: (updatedItems[itemIndex].quantity || 1) + 1,
      };
      this.cartItemsSubject.next(updatedItems);
      this.saveToLocalStorage();
    }
  }

  decrementQuantity(id: string) {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      const currentQuantity = updatedItems[itemIndex].quantity || 1;
      if (currentQuantity > 1) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: currentQuantity - 1,
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
    console.log('Cart opened');
  }

  closeCart() {
    this.isCartOpenSubject.next(false);
    console.log('Cart closed');
  }

  toggleCart() {
    const newState = !this.isCartOpenSubject.value;
    this.isCartOpenSubject.next(newState);
    console.log('Cart toggled to:', newState);
  }

  private saveToLocalStorage() {
    const items = this.cartItemsSubject.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    console.log('Saved cart items to localStorage:', items);
  }
}
