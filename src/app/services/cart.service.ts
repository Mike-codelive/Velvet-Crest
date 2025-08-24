import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductSummary } from '../models/product-summary.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<ProductSummary[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addItem(product: ProductSummary) {
    const currentItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next([...currentItems, product]);
  }

  removeItem(id: string) {
    const currentItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next(currentItems.filter((item) => item.id !== id));
  }
}
