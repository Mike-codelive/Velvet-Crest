import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { ProductSummary } from '../models/product-summary.model';
import { ProductCardComponent } from '../UI/product-card/product-card.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  allProducts$!: Observable<ProductSummary[]>;
  loading$!: Observable<boolean>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.allProducts$ = this.productService.allProducts$;
    this.loading$ = this.productService.loading$;
    this.productService.fetchAllProducts();
  }
}
