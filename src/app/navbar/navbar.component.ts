import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { ProductSummary } from '../models/product-summary.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  constructor(public productService: ProductService, private router: Router) {
    (window as any).productService = productService;
  }

  ngOnInit() {
    this.productService.fetchAllProducts();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.productService.allProducts$.subscribe((products) => {
          this.searchResults = products.filter((product) =>
            product.name.toLowerCase().includes(term.toLowerCase())
          );
        });
      });
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onSelectProduct(product: ProductSummary) {
    this.router.navigate(['/product', product.id]).then(() => {
      window.scrollTo({ top: 0 });
    });
    this.searchTerm = '';
    this.searchResults = [];
  }

  searchTerm = '';
  searchResults: ProductSummary[] = [];
  private searchSubject = new Subject<string>();
  private menuStates: { [key: string]: number } = {};
  isMenuOpen: boolean = false;
  isSearchVisible: boolean = true;
  activeMenu: number | null = null;
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

  toggleDropMenu(index: number) {
    this.activeMenu = this.activeMenu === index ? null : index;
    this.toggleSearch();
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
