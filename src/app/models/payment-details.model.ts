import { FormControl } from '@angular/forms';

export interface PaymentDetailsFormModel {
  cardNumber: FormControl<string>;
  expiry: FormControl<string>;
  cvc: FormControl<string>;
}
