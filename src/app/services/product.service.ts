import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of } from 'rxjs';
import { API_CONFIG } from '../../utils/api-config';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = API_CONFIG.productsUrl;
  private singleProductUrl = API_CONFIG.singleProductUrl;
  private featuredProductsSubject = new BehaviorSubject<Product[]>([]);
  public featuredProducts$ = this.featuredProductsSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchFeaturedProducts(): void {
    this.loadingSubject.next(true);
    this.http
      .get<Product[]>(this.productsUrl)
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

  fetchSingleProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.singleProductUrl}${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching single product:', error);
        return of({ id: '0', name: 'Error', price: 0 } as Product);
      })
    );
  }
}
