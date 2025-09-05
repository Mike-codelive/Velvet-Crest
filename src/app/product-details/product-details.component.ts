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
import { FormsModule } from '@angular/forms';
import { ProductColor } from '../models/product-color.model';
import { CartService } from '../services/cart.service';
import { ProductSummary } from '../models/product-summary.model';

Swiper.use([Pagination, Navigation]);

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CtaComponent,
    CardComponent,
    FormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  product: ProductDetails | null = null;
  swiper: Swiper | null = null;
  isMobile: boolean = window.innerWidth <= 832;
  selectedBuyType: string = 'one_time';
  isDropdownOpen: boolean = false;
  selectedPlan: string = '';
  quantity: number = 1;
  isColorSelectorOpen: boolean = false;
  selectedColor: ProductColor | null = null;
  colors: ProductColor[] = [];
  totalImages: number = 0;
  loadedImages: number = 0;
  allImagesLoaded: boolean = false;
  isGiftWrap: boolean = false; // Track gift wrap selection

  private hexColorNames: Record<string, string> = {
    '#ff0000': 'Red',
    '#00ff00': 'Green',
    '#0000ff': 'Blue',
    '#ffffff': 'White',
    '#000': 'Black',
    '#ff69b4': 'Hot Pink',
    '#ffa500': 'Orange',
    '#ffff00': 'Yellow',
    '#800080': 'Purple',
    '#008000': 'Dark Green',
    '#c0c0c0': 'Silver',
    '#808080': 'Gray',
  };

  private inferColorName(hex: string): string {
    const normalizedHex = hex.toLowerCase().replace('#', '');
    if (this.hexColorNames[hex.toLowerCase()]) {
      return this.hexColorNames[hex.toLowerCase()];
    }
    switch (normalizedHex) {
      case 'ff0000':
        return 'Red';
      case 'ffb900':
        return 'Yellow';
      case '00ff00':
        return 'Green';
      case '0000ff':
        return 'Blue';
      case 'ffffff':
        return 'White';
      case '000':
        return 'Black';
      default:
        return 'Custom Color';
    }
  }

  selectColor(color: ProductColor) {
    this.selectedColor = color;
    this.isColorSelectorOpen = false;
  }

  selectPlan(value: string) {
    this.selectedPlan = value;
    this.isDropdownOpen = false;
  }

  get displayedPlan(): string {
    switch (this.selectedPlan) {
      case '1_week':
        return 'Every 1 Week';
      case '2_weeks':
        return 'Every 2 Weeks';
      case '4_weeks':
        return 'Every 4 Weeks';
      case '8_weeks':
        return 'Every 8 Weeks';
      default:
        return 'Select Frequency';
    }
  }

  testimonials = [
    {
      id: 1,
      testimonial: 'Absolutely stunning craftsmanship...',
      author: 'Isabel M.',
    },
    { id: 2, testimonial: 'I was genuinely surprised...', author: 'Julian R.' },
    {
      id: 3,
      testimonial: 'VelvetCrest exceeded my expectations...',
      author: 'Lena D.',
    },
    {
      id: 4,
      testimonial: 'It’s rare to find something...',
      author: 'Marcus T.',
    },
  ];

  menuSections = [
    { title: 'About', items: [] },
    {
      title: 'Craftsmanship',
      items: [
        'We build all our furniture pieces in small artisanal batches, focusing on quality, precision, and lasting craftsmanship. Each item is assembled and inspected just before delivery to ensure it arrives in pristine condition, ready to elevate your space. Most of our designs follow a modern-classic style with neutral tones, unless stated otherwise on the product page. Please contact us if you have any questions about our materials, finishes, or build process.',
      ],
    },
    {
      title: 'Shipping',
      items: [
        'All orders are carefully packed and dispatched from our design studio in Mexico. We aim to process and ship all furniture within 1–2 business days. Larger items or custom orders may require slightly more time for preparation and packaging. Free shipping is available across Mexico on orders over $2,000 MXN. For international orders, shipping rates, duties, and taxes are calculated and prepaid at checkout — we handle all customs procedures so your piece arrives without delays. US shipping is free on orders over $500 USD.',
      ],
    },
  ];

  @ViewChild('swiperContainerSingleProduct')
  swiperContainerSingleProduct!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private titleService: Title,
    private cartService: CartService
  ) {}

  onQuantityInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    let input = inputEl.value.trim();

    input = input.replace(/\D/g, '').slice(0, 3);

    let num = parseInt(input, 10) || 1;

    if (num > 999) num = 999;
    else if (num < 1) num = 1;

    this.quantity = num;
    inputEl.value = String(num);
  }

  preventInvalidKeys(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  increaseQuantity() {
    if (this.quantity < 999) this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    console.log('AddToCart called with qty:', this.quantity);

    if (this.product && this.quantity > 0) {
      const isSubscribed = this.selectedBuyType === 'Subscribe';
      const giftWrap = this.isGiftWrap;

      const productWithColor: ProductSummary = {
        ...this.product,
        image: this.product.images[0].url,
      };

      console.log('Before cartService.addItem');
      let selectedColorHex =
        this.selectedColor?.hex ||
        (this.product.colors?.[0]
          ? `#${this.product.colors[0].replace(/^#/, '')}`
          : undefined);

      this.cartService.addItem(
        productWithColor,
        this.quantity,
        isSubscribed,
        giftWrap,
        selectedColorHex,
        isSubscribed ? this.selectedPlan : undefined
      );
      console.log('After cartService.addItem');
    }
  }

  onGiftWrapChange(event: Event) {
    this.isGiftWrap = (event.target as HTMLInputElement).checked;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.fetchSingleProduct(id).subscribe((product) => {
        this.product = product;
        this.totalImages = product.images.length;
        if (product.colors && Array.isArray(product.colors)) {
          this.colors = product.colors.map((hex: string) => ({
            hex: hex.toLowerCase(),
            name: this.inferColorName(hex),
          }));
          if (this.colors.length > 0) {
            this.selectedColor = this.colors[0]; // Default to first color
          }
        }
        this.titleService.setTitle(
          `VelvetCrest - ${capitalizeWords(product.name)}`
        );
        this.menuSections[0].title = `About ${capitalizeWords(product.name)}`;
        this.menuSections[0].items[0] = product.description || '';
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
      this.allImagesLoaded = true;
      setTimeout(() => this.initializeSwiper(), 0);
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
        init: (swiper) => this.updateNavButtons(swiper),
        slideChange: (swiper) => this.updateNavButtons(swiper),
      },
    });
  }

  updateNavButtons(swiper: Swiper) {
    const prevEl = document.querySelector('.product-details-navigation-prev');
    const nextEl = document.querySelector('.product-details-navigation-next');
    if (prevEl) prevEl.classList.toggle('hidden', swiper.isBeginning);
    if (nextEl) nextEl.classList.toggle('hidden', swiper.isEnd);
  }

  expandedSections: boolean[] = new Array(this.menuSections.length).fill(false);

  toggleSection(index: number) {
    const isCurrentlyOpen = this.expandedSections[index];
    this.expandedSections.fill(false);
    if (!isCurrentlyOpen) this.expandedSections[index] = true;
  }

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 832;
    if (this.isMobile && !wasMobile)
      setTimeout(() => this.initProductReviewsSwiper(), 0);
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}
