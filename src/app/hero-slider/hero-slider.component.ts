import { Component, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

Swiper.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css'],
  imports: [CommonModule],
})
export class HeroSliderComponent implements AfterViewInit {
  swiper!: Swiper;

  ngAfterViewInit() {
    this.swiper = new Swiper('.hero-swiper', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 5000,
        pauseOnMouseEnter: true,
      },
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
    });
  }
}
