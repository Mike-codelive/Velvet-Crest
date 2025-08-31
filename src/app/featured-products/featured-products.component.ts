import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { ProductSummary } from '../models/product-summary.model';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Observable, take } from 'rxjs';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import { ProductCardComponent } from '../UI/product-card/product-card.component';
import { NavigationService } from '../services/navigation.service';

Swiper.use([Pagination, Navigation]);

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, AsyncPipe, ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
})
export class FeaturedProductsComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  featuredProducts$!: Observable<ProductSummary[]>;
  loading$!: Observable<boolean>;
  swiper: Swiper | null = null;

  @ViewChild('trigger', { static: true }) triggerElement!: ElementRef;
  @ViewChild('skeletonSwiperContainer') skeletonSwiperContainer!: ElementRef;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  hasRenderedSwiper = false;
  totalImages = 0;
  loadedImages = 0;
  allImagesLoaded = false;

  constructor(
    private productService: ProductService,
    private navigationService: NavigationService
  ) {}

  navigateToShop() {
    this.navigationService.navToShop();
  }

  ngOnInit(): void {
    this.featuredProducts$ = this.productService.featuredProducts$;
    this.loading$ = this.productService.loading$;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.productService.fetchFeaturedProducts();
          }, 500);
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
    setTimeout(() => {
      if (this.skeletonSwiperContainer?.nativeElement) {
        new Swiper(this.skeletonSwiperContainer.nativeElement, {
          slidesPerView: 1,
          spaceBetween: 8,
          breakpoints: {
            850: { slidesPerView: 2 },
            1025: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          },
        });
      }
    }, 0);
  }

  ngAfterViewChecked(): void {
    if (!this.hasRenderedSwiper) {
      this.featuredProducts$.pipe(take(1)).subscribe((products) => {
        if (products.length > 0 && this.swiperContainer?.nativeElement) {
          this.totalImages = products.length;
        }
      });
    }
  }

  onImageLoad(): void {
    this.loadedImages++;
    if (this.loadedImages === this.totalImages) {
      this.allImagesLoaded = true;
      this.hasRenderedSwiper = true;
      this.initializeSwiper();
    }
  }

  initializeSwiper(): void {
    if (this.swiper) this.swiper.destroy(true, true);

    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      modules: [Pagination, Navigation],
      slidesPerView: 1,
      slidesPerGroup: 1,
      loop: true,
      spaceBetween: 8,
      breakpoints: {
        850: { slidesPerView: 2, slidesPerGroup: 1 },
        1025: { slidesPerView: 3, slidesPerGroup: 1 },
        1200: { slidesPerView: 4, slidesPerGroup: 1 },
      },
      pagination: {
        el: '.featured-product-swiper-pagination',
        type: 'progressbar',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}
