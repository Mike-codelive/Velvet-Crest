import { Component, AfterViewInit } from '@angular/core';
import { HeroSliderComponent } from './hero-slider/hero-slider.component';
import { FeaturedComponent } from './featured/featured.component';
import { CtaComponent } from './cta/cta.component';
import { CollectionSliderComponent } from './collection-slider/collection-slider.component';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    HeroSliderComponent,
    FeaturedComponent,
    CtaComponent,
    CollectionSliderComponent,
  ],
})
export class AppComponent implements AfterViewInit {
  isLoaded = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
    });
  }
}
