import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-cta',
  imports: [ButtonComponent],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css',
})
export class CtaComponent {}
