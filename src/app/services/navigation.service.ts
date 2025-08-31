import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  navToShop() {
    this.router.navigate(['/shop']).then(() => {
      window.scrollTo({ top: 0 });
    });
  }

  navigateToHome() {
    this.router.navigate(['/']).then(() => {
      window.scrollTo({ top: 0 });
    });
  }

  navigateToSearch(query: string) {
    const sanitizedTerm = this.sanitizeInput(query);
    if (sanitizedTerm.trim()) {
      const limitedTerm = sanitizedTerm.substring(0, 50);
      this.router
        .navigate(['/search'], { queryParams: { q: limitedTerm } })
        .then(() => {
          window.scrollTo({ top: 0 });
        });
    }
  }

  navigateToProduct(id: string) {
    this.router.navigate(['/product', id]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log(`Navigated to product ${id} and scrolled to top`);
    });
  }

  navigateToRoute(route: string[]) {
    this.router.navigate(route).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log(`Navigated to ${route.join('/')} and scrolled to top`);
    });
  }

  private sanitizeInput(input: string): string {
    return input.replace(/[<>&"'\/]/g, '');
  }
}
