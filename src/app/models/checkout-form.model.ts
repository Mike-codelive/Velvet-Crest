import { FormControl } from '@angular/forms';

export interface CheckoutFormModel {
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
