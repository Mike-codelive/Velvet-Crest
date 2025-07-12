import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public productService: ProductService) {
    // Expose service for console testing
    (window as any).productService = productService;
  }

  private menuStates: { [key: string]: number } = {};
  isMenuOpen: boolean = false;
  isSearchVisible: boolean = true;

  resizeTimeout: any;

  @HostListener('window:resize')
  onResize(): void {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.checkResolution();
    }, 200);
  }

  menuState(menuId: string): number {
    return this.menuStates[menuId] || 0;
  }

  setupMenuState(menuId: string, index: number): void {
    if (!this.menuStates[menuId]) {
      this.menuStates[menuId] = 0;
    }
    this.menuStates[menuId] = index;
  }

  onMouseEnter(menuId: string, index: number) {
    this.setupMenuState(menuId, index);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.updateBodyScroll();
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  private updateBodyScroll() {
    document.body.style.overflowY = this.isMenuOpen ? 'hidden' : 'auto';
    document.body.style.paddingRight = this.isMenuOpen ? '15px' : '0';
  }

  private checkResolution() {
    if (window.innerWidth >= 1240 && this.isMenuOpen) {
      this.isMenuOpen = false;
      this.updateBodyScroll();
    }
  }
}
