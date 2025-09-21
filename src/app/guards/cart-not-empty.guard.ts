import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartNotEmptyGuard implements CanActivate {
  constructor(private cartService: CartService, private router: Router) {}

  canActivate(): boolean {
    const hasItems = this.cartService.getCartCount() > 0;

    if (!hasItems) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
