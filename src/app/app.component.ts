import { Component } from '@angular/core';
import { HeroSliderComponent } from './hero-slider/hero-slider.component';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HeroSliderComponent],
})
export class AppComponent {
  title = 'VelvetCrest';
}
