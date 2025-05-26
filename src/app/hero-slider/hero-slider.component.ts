import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ButtonComponent } from '../button/button.component';

Swiper.use([Pagination, Autoplay, EffectFade]);

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css'],
  imports: [CommonModule, ButtonComponent],
})
export class HeroSliderComponent implements AfterViewInit {
  swiper!: Swiper;

  private heroSwiperBulletStyles(index: number): void {
    const paginationBullet = document.querySelectorAll(
      '.swiper-pagination-hero .swiper-pagination-bullet'
    );

    if (index === 1) {
      paginationBullet.forEach((el) => {
        el.classList.add('hero-swiper-pagination-bullet');
        el.classList.contains('swiper-pagination-bullet-active') &&
          el.classList.add('hero-swiper-pagination-bullet-active');
      });
    } else {
      paginationBullet.forEach((el) => {
        el.classList.remove('hero-swiper-pagination-bullet');
        el.classList.remove('hero-swiper-pagination-bullet-active');
      });
    }
  }

  ngAfterViewInit() {
    this.swiper = new Swiper('.hero-swiper', {
      modules: [Pagination, Autoplay, EffectFade],
      slidesPerView: 1,
      spaceBetween: 0,
      pagination: {
        el: '.swiper-pagination-hero',
        clickable: true,
      },
      autoplay: {
        delay: 5000,
        pauseOnMouseEnter: true,
      },
      loop: true,
      on: {
        slideChange: (swiper) => {
          const activeIndex = swiper.realIndex;
          this.heroSwiperBulletStyles(activeIndex);
        },
      },

      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
    });
  }
}
