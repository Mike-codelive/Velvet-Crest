import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
})
export class AppComponent implements AfterViewInit {
  isLoaded = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
    });
  }
}
