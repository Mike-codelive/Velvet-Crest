import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
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

Swiper.use([Pagination, Navigation]);

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  product: ProductDetails | null = null;
  swiper: Swiper | null = null;
  totalImages = 0;
  loadedImages = 0;

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

  ngAfterViewInit(): void {}

  onImageLoaded(): void {
    this.loadedImages++;
    if (this.loadedImages === this.totalImages) {
      setTimeout(() => this.initializeSwiper(), 50); // small delay helps avoid race condition
    }
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
}
