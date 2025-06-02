import { Component } from '@angular/core';
import { CardComponent } from '../UI/card/card.component';

@Component({
  selector: 'app-testimonials',
  imports: [CardComponent],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
})
export class TestimonialsComponent {}
