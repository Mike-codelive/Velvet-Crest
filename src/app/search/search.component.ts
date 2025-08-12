import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ProductSummary } from '../models/product-summary.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchTerm = '';
  searchResults: ProductSummary[] = [];
  private searchSubject = new Subject<string>();

  constructor(private productService: ProductService, private router: Router) {}

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
    this.router.navigate(['/product', product.id]);
  }
}
