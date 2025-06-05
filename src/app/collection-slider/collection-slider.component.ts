import { Component } from '@angular/core';
import { Pagination } from 'swiper/modules';
import Swiper from 'swiper';

@Component({
  selector: 'app-collection-slider',
  imports: [],
  templateUrl: './collection-slider.component.html',
  styleUrl: './collection-slider.component.css',
})
export class CollectionSliderComponent {
  slides = [
    {
      image: '/collection_1.jpg',
      title: 'Mexico City',
      id: 0,
      description: 'A radiant gem from Mexico City, crafted with precision.',
    },
    {
      image: '/collection_2.jpg',
      title: 'Albanian',
      id: 1,
      description:
        'A luminous opal with ethereal beauty, exclusive to VelvetCrest.',
    },
    {
      image: '/collection_3.jpg',
      title: 'Bosnia',
      id: 2,
      description: 'Rare opal from Bosnia, showcasing timeless elegance.',
    },
    {
      image: '/collection_4.jpg',
      title: 'Croatia',
      id: 3,
      description: 'Rare opal from Bosnia, showcasing timeless elegance.',
    },
    {
      image: '/collection_5.jpg',
      title: 'Romania',
      id: 4,
      description: 'Rare opal from Bosnia, showcasing timeless elegance.',
    },
    {
      image: '/collection_6.jpg',
      title: 'Germany',
      id: 5,
      description: 'Rare opal from Bosnia, showcasing timeless elegance.',
    },
  ];

  swiper!: Swiper;

  ngAfterViewInit() {
    this.swiper = new Swiper('.collection-swiper', {
      modules: [Pagination],
      // autoHeight: true,
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
}
