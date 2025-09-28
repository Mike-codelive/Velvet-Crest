import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  NonNullableFormBuilder,
} from '@angular/forms';
import { CartService } from './../services/cart.service';
import { CartItem } from './../models/product-summary.model';
import { getColorName } from '../../utils/get-color-name';
import { getSubscriptionDisplay as getSubDisplayUtil } from '../../utils/get-subscription-display';
import { Router } from '@angular/router';

interface CheckoutFormModel {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  company: FormControl<string | null>;
  address: FormControl<string>;
  apartment: FormControl<string | null>;
  country: FormControl<string>;
  postalCode: FormControl<string>;
  city: FormControl<string>;
  phone: FormControl<string>;
  cardNumber: FormControl<string>;
  expiry: FormControl<string>;
  cvc: FormControl<string>;
}

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
  subtotal = 0;
  cartItemCount = 0;

  checkoutForm!: FormGroup<CheckoutFormModel>;
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

  open = false;
  selectedCountry: string = 'Mexico';

  selectedPayment: 'card' | 'paypal' = 'card';

  constructor(
    private cartService: CartService,
    private fb: NonNullableFormBuilder,
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

    this.checkoutForm = this.fb.group<CheckoutFormModel>({
      email: this.fb.control('', [Validators.required, Validators.email]),
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
      company: this.fb.control<string | null>(null),
      address: this.fb.control('', Validators.required),
      apartment: this.fb.control<string | null>(null),
      country: this.fb.control(this.selectedCountry, Validators.required),
      postalCode: this.fb.control('', Validators.required),
      city: this.fb.control('', Validators.required),
      phone: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^[0-9]{7,15}$/),
      ]),
      cardNumber: this.fb.control(
        '',
        this.selectedPayment === 'card'
          ? [Validators.required, Validators.pattern(/^\d{16}$/)]
          : []
      ),

      expiry: this.fb.control(
        '',
        this.selectedPayment === 'card' ? [Validators.required] : []
      ),
      cvc: this.fb.control(
        '',
        this.selectedPayment === 'card' ? [Validators.required] : []
      ),
    });
  }

  // Individual control getters
  get email() {
    return this.checkoutForm.controls.email;
  }
  get firstName() {
    return this.checkoutForm.controls.firstName;
  }
  get lastName() {
    return this.checkoutForm.controls.lastName;
  }
  get company() {
    return this.checkoutForm.controls.company;
  }
  get address() {
    return this.checkoutForm.controls.address;
  }
  get apartment() {
    return this.checkoutForm.controls.apartment;
  }
  get country() {
    return this.checkoutForm.controls.country;
  }
  get postalCode() {
    return this.checkoutForm.controls.postalCode;
  }
  get city() {
    return this.checkoutForm.controls.city;
  }
  get phone() {
    return this.checkoutForm.controls.phone;
  }
  get cardNumber() {
    return this.checkoutForm.controls.cardNumber;
  }
  get expiry() {
    return this.checkoutForm.controls.expiry;
  }
  get cvc() {
    return this.checkoutForm.controls.cvc;
  }

  sanitizeInput(value: string | null): string {
    if (!value) return '';
    return value.replace(/[^a-zA-ZÀ-ÿ0-9\s.'-]/g, '');
  }

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

    const rawValue = this.checkoutForm.getRawValue();

    const sanitized = {
      ...rawValue,
      firstName: this.sanitizeInput(rawValue.firstName),
      lastName: this.sanitizeInput(rawValue.lastName),
      company: this.sanitizeInput(rawValue.company),
      address: this.sanitizeInput(rawValue.address),
      apartment: this.sanitizeInput(rawValue.apartment),
      postalCode: this.sanitizeInput(rawValue.postalCode),
      city: this.sanitizeInput(rawValue.city),
    };

    console.log('Form submitted:', sanitized);
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
    this.checkoutForm.patchValue({ phone: input.value }, { emitEvent: false });
  }

  onCreditCardInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let sanitized = input.value.replace(/\D/g, '');
    const maxLength = 16;
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    input.value = sanitized;
    this.checkoutForm.patchValue(
      { cardNumber: sanitized },
      { emitEvent: false }
    );
  }

  selectPayment(method: 'card' | 'paypal') {
    this.selectedPayment = method;

    if (method === 'card') {
      this.cardNumber.setValidators([Validators.required]);
      this.expiry.setValidators([Validators.required]);
      this.cvc.setValidators([Validators.required]);
    } else {
      this.checkoutForm.patchValue({ cardNumber: '', expiry: '', cvc: '' });
      this.cardNumber.clearValidators();
      this.expiry.clearValidators();
      this.cvc.clearValidators();
    }

    this.cardNumber.updateValueAndValidity();
    this.expiry.updateValueAndValidity();
    this.cvc.updateValueAndValidity();
  }

  getColorName(hex?: string): string {
    return hex ? getColorName(hex) : 'Custom Color';
  }

  getSubscriptionDisplay(sub?: string): string {
    return sub ? getSubDisplayUtil(sub) : 'Unknown Frequency';
  }
}
