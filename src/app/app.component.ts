import { Component, AfterViewInit } from '@angular/core';
import { HeroSliderComponent } from './hero-slider/hero-slider.component';
import { FeaturedComponent } from './featured/featured.component';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeroSliderComponent, FeaturedComponent],
})
export class AppComponent implements AfterViewInit {
  isLoaded = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
    });
  }
}
