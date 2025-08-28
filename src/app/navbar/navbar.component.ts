import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { ProductSummary } from '../models/product-summary.model';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CartDropdownComponent } from '../UI/cart-dropdown/cart-dropdown.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, CartDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(
    public productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {
    (window as any).productService = productService;
  }

  searchTerm = '';
  searchResults: ProductSummary[] = [];
  private menuStates: { [key: string]: number } = {};
  isMenuOpen: boolean = false;
  isSearchVisible: boolean = true;
  activeMenu: number | null = null;
  resizeTimeout: any;
  isCartOpen = false;
  cartItemCount = 0;
  private cartOpenSubscription!: Subscription;

  ngOnInit() {
    this.productService.fetchAllProducts();
    this.cartOpenSubscription = this.cartService.isCartOpen$.subscribe(
      (open) => {
        this.isCartOpen = open;
        this.updateBodyScroll();
      }
    );
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItemCount = items.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
    });
  }

  toggleCart() {
    this.cartService.toggleCart();
  }

  onSearch() {
    const sanitizedTerm = this.sanitizeInput(this.searchTerm);
    if (sanitizedTerm.trim()) {
      const limitedTerm = sanitizedTerm.substring(0, 50);
      this.router.navigate(['/search'], { queryParams: { q: limitedTerm } });
      this.searchTerm = '';
      this.isMenuOpen = false;
      this.updateBodyScroll();
    }
  }

  onSelectProduct(product: ProductSummary) {
    this.router.navigate(['/product', product.id]).then(() => {
      window.scrollTo({ top: 0 });
    });
    this.searchTerm = '';
    this.searchResults = [];
  }

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

  toggleDropMenu(index: number) {
    this.activeMenu = this.activeMenu === index ? null : index;
    this.toggleSearch();
  }

  updateBodyScroll() {
    const isAnyOpen = this.isMenuOpen || this.isCartOpen;
    document.body.style.overflowY = isAnyOpen ? 'hidden' : 'auto';
    document.body.style.paddingRight = isAnyOpen ? '15px' : '0';
  }

  private sanitizeInput(input: string): string {
    return input.replace(/[<>&"'\/]/g, '');
  }

  private checkResolution() {
    if (window.innerWidth >= 1240 && this.isMenuOpen) {
      this.isMenuOpen = false;
      this.updateBodyScroll();
    }
  }

  ngOnDestroy() {
    if (this.cartOpenSubscription) {
      this.cartOpenSubscription.unsubscribe();
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
    this.isMenuOpen = false;
    this.updateBodyScroll();
  }
}
