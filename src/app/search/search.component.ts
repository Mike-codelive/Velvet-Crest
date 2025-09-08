import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ProductSummary } from '../models/product-summary.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCardComponent } from '../UI/product-card/product-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  allProducts: ProductSummary[] = [];
  searchResults: ProductSummary[] = [];

  searchTerm: string = '';
  sortBy: string = 'price-ascending';
  selectedCompany: string = 'All';
  selectedCategory: string = 'All';
  selectedColor: string = 'All';
  freeShippingOnly: boolean = false;

  companies: string[] = [];
  categories: string[] = [];
  colors: string[] = [];

  sortOptions = [
    { value: 'price-ascending', label: 'Price: Low to High' },
    { value: 'price-descending', label: 'Price: High to Low' },
    { value: 'name-ascending', label: 'Name: A to Z' },
  ];

  showColorDropdown: boolean = false;

  toggleColorDropdown(): void {
    this.showColorDropdown = !this.showColorDropdown;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.showColorDropdown = false;
    this.onFilterChange();
  }

  private colorNameMap: { [key: string]: string } = {
    '#000': 'Black',
    '#FFFFFF': 'White',
    '#FF0000': 'Red',
    '#00FF00': 'Lime',
    '#0000FF': 'Blue',
    '#FFB900': 'Yellow',
    '#FFA500': 'Orange',
    '#800080': 'Purple',
    '#808080': 'Gray',
    '#A52A2A': 'Brown',
    '#FFC0CB': 'Pink',
    '#00FFFF': 'Cyan',
    '#008000': 'Green',
    '#FFD700': 'Gold',
    '#F5F5DC': 'Beige',
  };

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.productService.fetchAllProducts();

    this.productService.allProducts$.subscribe((products) => {
      this.allProducts = products;
      this.buildDropdownOptions();
      this.filterAndSortResults();
    });

    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['q'] || '';
      this.filterAndSortResults();
    });
  }

  private buildDropdownOptions() {
    this.companies = [
      'All',
      ...new Set(this.allProducts.map((p) => p.company)),
    ];
    this.categories = [
      'All',
      ...new Set(this.allProducts.map((p) => p.category)),
    ];
    this.colors = [
      'All',
      ...new Set(this.allProducts.flatMap((p) => p.colors ?? [])),
    ];
  }

  filterAndSortResults() {
    this.searchResults = this.allProducts
      .filter((product) => this.applyFilters(product))
      .sort((a, b) => {
        if (this.sortBy === 'price-ascending') return a.price - b.price;
        if (this.sortBy === 'price-descending') return b.price - a.price;
        if (this.sortBy === 'name-ascending')
          return a.name.localeCompare(b.name);
        return 0;
      });
  }

  private applyFilters(product: ProductSummary): boolean {
    const term = this.searchTerm.toLowerCase().trim();

    const matchesSearch =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.company.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.price.toString().includes(term);

    const matchesCompany =
      this.selectedCompany === '' ||
      this.selectedCompany === 'All' ||
      product.company.toLowerCase() === this.selectedCompany.toLowerCase();

    const matchesCategory =
      this.selectedCategory === '' ||
      this.selectedCategory === 'All' ||
      product.category.toLowerCase() === this.selectedCategory.toLowerCase();

    const matchesColor =
      this.selectedColor === '' ||
      this.selectedColor === 'All' ||
      (product.colors &&
        product.colors
          .map((c) => c.toLowerCase())
          .includes(this.selectedColor.toLowerCase()));

    const matchesShipping = !this.freeShippingOnly || product.shipping === true;

    return (
      matchesSearch &&
      matchesCompany &&
      matchesCategory &&
      matchesColor &&
      matchesShipping
    );
  }

  onSortChange() {
    this.filterAndSortResults();
  }

  onFilterChange() {
    this.filterAndSortResults();
  }

  onViewDetails(product: ProductSummary) {
    this.router.navigate(['/product', product.id]).then(() => {
      window.scrollTo({ top: 0 });
    });
  }

  getColorLabel(color: string): string {
    if (!color || color === 'All') return 'All';
    const normalized = color.toUpperCase();
    return this.colorNameMap[normalized] || normalized;
  }

  dropdownStates: { [key: string]: boolean } = {
    category: false,
    color: false,
    company: false,
    sort: false,
  };

  toggleDropdown(dropdownName: string): void {
    const isCurrentlyOpen = this.dropdownStates[dropdownName];

    Object.keys(this.dropdownStates).forEach((key) => {
      this.dropdownStates[key] = false;
    });

    if (!isCurrentlyOpen) {
      this.dropdownStates[dropdownName] = true;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isInsideDropdown = ['category', 'color', 'company', 'sort'].some(
      (dropdown) => {
        const element = document.querySelector(`[data-dropdown="${dropdown}"]`);
        return element && element.contains(target);
      }
    );

    if (!isInsideDropdown) {
      Object.keys(this.dropdownStates).forEach((key) => {
        this.dropdownStates[key] = false;
      });
    }
  }
}
