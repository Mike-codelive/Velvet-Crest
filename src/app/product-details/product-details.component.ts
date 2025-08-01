import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../services/product.service';
import { ProductDetails } from '../models/product-details.model';
import { ButtonComponent } from '../button/button.component';
import { capitalizeWords } from '../../utils/string.utils';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { CtaComponent } from '../cta/cta.component';
import { CardComponent } from '../UI/card/card.component';

Swiper.use([Pagination, Navigation]);

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CtaComponent, CardComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  product: ProductDetails | null = null;
  swiper: Swiper | null = null;
  totalImages = 0;
  loadedImages = 0;
  isMobile: boolean = window.innerWidth <= 832;

  testimonials = [
    {
      id: 1,
      testimonial:
        'Absolutely stunning craftsmanship. I’ve never owned furniture that felt this luxurious — every detail is so thoughtful.',
      author: 'Isabel M.',
    },
    {
      id: 2,
      testimonial:
        'I was genuinely surprised by the quality. It instantly became the centerpiece of my living room. Timeless and elegant.',
      author: 'Julian R.',
    },
    {
      id: 3,
      testimonial:
        'VelvetCrest exceeded my expectations. The materials, the finish — everything feels premium. Worth every cent.',
      author: 'Lena D.',
    },
    {
      id: 4,
      testimonial:
        'It’s rare to find something that feels both refined and personal. This is furniture that tells a story.',
      author: 'Marcus T.',
    },
  ];

  @ViewChild('swiperContainerSingleProduct')
  swiperContainerSingleProduct!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private titleService: Title
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.fetchSingleProduct(id).subscribe((product) => {
        this.product = product;
        this.totalImages = product.images.length;
        this.titleService.setTitle(
          `VelvetCrest - ${capitalizeWords(product.name)}`
        );
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.isMobile) {
      setTimeout(() => this.initProductReviewsSwiper(), 0);
    }
  }

  onImageLoaded(): void {
    this.loadedImages++;
    if (this.loadedImages === this.totalImages) {
      setTimeout(() => this.initializeSwiper(), 50);
    }
  }

  initProductReviewsSwiper() {
    this.swiper = new Swiper('.testimonials-product-reviews-swiper', {
      modules: [Pagination],
      centeredSlides: true,
      slidesPerView: 1.5,
      spaceBetween: 8,
      pagination: {
        el: '.testimonials-product-reviews-pagination',
        type: 'progressbar',
      },
      loop: true,
    });
  }

  initializeSwiper(): void {
    if (!this.swiperContainerSingleProduct) return;

    this.swiper = new Swiper(this.swiperContainerSingleProduct.nativeElement, {
      slidesPerView: 1,
      slidesPerGroup: 1,
      loop: false,
      pagination: {
        el: '.product-details-swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      navigation: {
        nextEl: '.product-details-navigation-next',
        prevEl: '.product-details-navigation-prev',
      },
      on: {
        init: (swiper) => {
          this.updateNavButtons(swiper);
        },
        slideChange: (swiper) => {
          this.updateNavButtons(swiper);
        },
      },
    });
  }

  updateNavButtons(swiper: Swiper) {
    const prevEl = document.querySelector('.product-details-navigation-prev');
    const nextEl = document.querySelector('.product-details-navigation-next');

    if (prevEl) {
      prevEl.classList.toggle('hidden', swiper.isBeginning);
    }
    if (nextEl) {
      nextEl.classList.toggle('hidden', swiper.isEnd);
    }
  }

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 832;

    if (this.isMobile && !wasMobile) {
      setTimeout(() => this.initProductReviewsSwiper(), 0);
    }
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}
