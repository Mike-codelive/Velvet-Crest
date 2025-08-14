import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ProductSummary } from '../models/product-summary.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchResults: ProductSummary[] = [];
  searchTerm = '';
  sortBy = 'price-ascending';
  sortOptions = [
    { value: 'price-ascending', label: 'Price: Low to High' },
    { value: 'price-descending', label: 'Price: High to Low' },
    { value: 'name-ascending', label: 'Name: A to Z' },
  ];

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.productService.fetchAllProducts();

    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['q'] || '';
      this.filterAndSortResults();
    });
  }

  filterAndSortResults() {
    this.productService.allProducts$.subscribe((products) => {
      this.searchResults = products
        .filter((product) => this.matchProduct(product, this.searchTerm))
        .sort((a, b) => {
          if (this.sortBy === 'price-ascending') return a.price - b.price;
          if (this.sortBy === 'price-descending') return b.price - a.price;
          if (this.sortBy === 'name-ascending')
            return a.name.localeCompare(b.name);
          return 0;
        });
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchTerm.trim() },
      });
    }
  }

  onSortChange() {
    this.filterAndSortResults();
  }

  onViewDetails(product: ProductSummary) {
    this.router.navigate(['/product', product.id]).then(() => {
      window.scrollTo({ top: 0 });
    });
  }

  private matchProduct(product: ProductSummary, term: string): boolean {
    const searchTerm = term.toLowerCase().trim();
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.company.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.price.toString().includes(searchTerm)
    );
  }
}
