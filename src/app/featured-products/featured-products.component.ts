import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

Swiper.use([Pagination]);

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
})
export class FeaturedProductsComponent implements OnInit, AfterViewInit {
  featuredProducts$!: Observable<Product[]>;
  loading$!: Observable<boolean>;
  swiper: Swiper | null = null;

  @ViewChild('trigger', { static: true }) triggerElement!: ElementRef;
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.featuredProducts$ = this.productService.featuredProducts$;
    this.loading$ = this.productService.loading$;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // setTimeout(() => {
          //   this.productService.fetchFeaturedProducts();
          // }, 500);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    if (this.triggerElement?.nativeElement) {
      observer.observe(this.triggerElement.nativeElement);
    }
  }

  ngAfterViewInit(): void {
    this.swiper = new Swiper('.featured-product-skeleton-swiper', {
      slidesPerView: 1,
      spaceBetween: 8,
      breakpoints: {
        850: { slidesPerView: 2 },
        1025: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
    });

    setTimeout(() => {
      const el = this.swiperEl?.nativeElement;
      if (el) {
        this.swiper = new Swiper(el, {
          modules: [Pagination],
          slidesPerView: 1,
          spaceBetween: 8,
          breakpoints: {
            850: { slidesPerView: 2.2 },
            1025: { slidesPerView: 3.2 },
            1200: { slidesPerView: 4.2 },
          },
          pagination: {
            el: '.collection-pagination',
            type: 'progressbar',
          },
        });
      }
    }, 0);
  }
}
