import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  cartItemCount: number = 0;
  checkoutForm!: FormGroup;
  submitted = false;
  countries: string[] = [
    'United States',
    'Mexico',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'Australia',
  ];

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      if (!items.length) {
        this.router.navigate(['/']);
      }
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

  get email() {
    return this.checkoutForm.get('email')!;
  }

  getColorName(hex?: string): string {
    return hex ? getColorName(hex) : 'Custom Color';
  }

  getSubscriptionDisplay(sub?: string): string {
    return sub ? getSubDisplayUtil(sub) : 'Unknown Frequency';
  }

  open = false;
  selectedCountry: string | null = 'Mexico';

  toggleDropdown() {
    this.open = !this.open;
  }

  selectCountry(country: string) {
    this.selectedCountry = country;
    this.checkoutForm.patchValue({ country });
    this.open = false;
  }

  onSubmit() {
    this.submitted = true;

    if (this.checkoutForm.invalid) {
      return;
    }

    console.log('Form submitted:', this.checkoutForm.value);

    // if (this.checkoutForm.valid) {
    // } else {
    //   this.checkoutForm.markAllAsTouched();
    // }
  }
}
