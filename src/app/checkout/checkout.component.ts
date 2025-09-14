import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CartService } from './../services/cart.service';
import { CartItem } from './../models/product-summary.model';
import { getColorName } from '../../utils/get-color-name';
import { getSubscriptionDisplay as getSubDisplayUtil } from '../../utils/get-subscription-display';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  cartItemCount: number = 0;
  checkoutForm!: FormGroup;

  constructor(private cartService: CartService, private fb: FormBuilder) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = [...items];
      this.cartItemCount = this.cartService.getCartCount();
      this.subtotal = this.cartService.getCartTotal();
    });

    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  getColorName(hex?: string): string {
    return hex ? getColorName(hex) : 'Custom Color';
  }

  getSubscriptionDisplay(sub?: string): string {
    return sub ? getSubDisplayUtil(sub) : 'Unknown Frequency';
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
