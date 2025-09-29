import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
})
export class AppComponent implements AfterViewInit {
  isLoaded = false;
  hideFooter = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.hideFooter = event.urlAfterRedirects.startsWith('/checkout');
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
    });
  }
}
