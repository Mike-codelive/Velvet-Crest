import { Component } from '@angular/core';
import { FeaturedComponent } from '../featured/featured.component';
import { HeroSliderComponent } from '../hero-slider/hero-slider.component';
import { CtaComponent } from '../cta/cta.component';
import { FeaturedProductsComponent } from '../featured-products/featured-products.component';
import { CollectionSliderComponent } from '../collection-slider/collection-slider.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';

@Component({
  selector: 'app-home',
  imports: [
    FeaturedComponent,
    HeroSliderComponent,
    CtaComponent,
    FeaturedProductsComponent,
    CollectionSliderComponent,
    TestimonialsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
