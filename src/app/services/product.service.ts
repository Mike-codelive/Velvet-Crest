import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of } from 'rxjs';
import { API_CONFIG } from '../../utils/api-config';
import { ProductSummary } from '../models/product-summary.model';
import { ProductDetails } from '../models/product-details.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = API_CONFIG.productsUrl;
  private singleProductUrl = API_CONFIG.singleProductUrl;
  private featuredProductsSubject = new BehaviorSubject<ProductSummary[]>([]);
  public featuredProducts$ = this.featuredProductsSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private allProductsSubject = new BehaviorSubject<ProductSummary[]>([]);
  public allProducts$ = this.allProductsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchFeaturedProducts(): void {
    this.loadingSubject.next(true);
    this.http
      .get<ProductSummary[]>(this.productsUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching products:', error);
          this.loadingSubject.next(false);
          return of([]);
        })
      )
      .subscribe((products) => {
        const featured = products.filter(
          (product) => product.featured === true
        );
        this.featuredProductsSubject.next(featured);
        this.loadingSubject.next(false);
      });
  }

  fetchAllProducts(): void {
    this.loadingSubject.next(true);
    this.http
      .get<ProductSummary[]>(this.productsUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching all products:', error);
          this.loadingSubject.next(false);
          return of([]);
        })
      )
      .subscribe((products) => {
        this.allProductsSubject.next(products);
        this.loadingSubject.next(false);
      });
  }

  fetchSingleProduct(id: string): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(`${this.singleProductUrl}${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching single product:', error);
        return of({ id: '0', name: 'Error', price: 0 } as ProductDetails);
      })
    );
  }
}
