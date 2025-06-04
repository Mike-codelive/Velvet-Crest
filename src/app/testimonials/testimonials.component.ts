import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { CardComponent } from '../UI/card/card.component';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

@Component({
  selector: 'app-testimonials',
  imports: [CardComponent, CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
})
export class TestimonialsComponent {
  testimonials = [
    {
      id: 1,
      testimonial: 'The Aztec Fire Opal is a masterpiece—stunning and unique!',
      author: 'Elena Morales, Mexico City',
    },
    {
      id: 2,
      testimonial: 'VelvetCrest’s opals elevated my collection to new heights.',
      author: 'Jasper Klein, New York',
    },
    {
      id: 3,
      testimonial: 'The craftsmanship of the Luna Glow Opal is breathtaking.',
      author: 'Sophia Laurent, Paris',
    },
    {
      id: 4,
      testimonial: 'A timeless addition to my jewelry—thank you, VelvetCrest!',
      author: 'Liam O’Connor, Dublin',
    },
    {
      id: 5,
      testimonial: 'The Herzegovinian Opal’s elegance is unmatched.',
      author: 'Anastasia Volkov, Moscow',
    },
    {
      id: 6,
      testimonial: 'VelvetCrest opals bring a rare beauty to every occasion.',
      author: 'Carlos Rivera, Madrid',
    },
    {
      id: 7,
      testimonial: 'I’m in awe of the vibrant hues in my new opal piece.',
      author: 'Aisha Patel, Mumbai',
    },
    {
      id: 8,
      testimonial: 'The quality and design are worth every penny—pure luxury!',
      author: 'Thomas Eriksson, Stockholm',
    },
  ];

  swiper: Swiper | null = null;
  isMobile: boolean = window.innerWidth <= 832;

  initSwiper() {
    this.swiper = new Swiper('.testimonials-swiper', {
      modules: [Pagination],
      centeredSlides: true,
      slidesPerView: 1.5,
      spaceBetween: 8,
      pagination: {
        el: '.testimonials-pagination',
        type: 'progressbar',
      },
      loop: true,
    });
  }

  ngAfterViewInit() {
    if (this.isMobile) {
      setTimeout(() => this.initSwiper(), 0);
    }
  }

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 832;

    if (this.isMobile && !wasMobile) {
      setTimeout(() => this.initSwiper(), 0);
    }
  }

  ngOnDestroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }
}
