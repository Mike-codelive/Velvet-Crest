// src/app/pages/checkout/checkout.component.ts
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
  checkoutForm!: FormGroup;

  constructor(private cartService: CartService, private fb: FormBuilder) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = [...items];
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

  onSubmit() {
    if (this.checkoutForm.valid) {
      console.log('Order placed ✅', {
        customer: this.checkoutForm.value,
        items: this.cartItems,
        subtotal: this.subtotal,
      });
      alert('Your order has been placed!');
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}
