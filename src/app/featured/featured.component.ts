import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured',
  imports: [CommonModule],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.css',
})
export class FeaturedComponent {
  collections = [
    {
      title: 'Luxury Gifts',
      description: 'Curated velvet boxes',
      image: '/featured_1.jpg',
      alt: 'Luxury Gifts collection',
      link: '/shop/coffee-gifts',
    },
    {
      title: 'Scented Glow',
      description: 'Artisanal candle sets',
      image: '/featured_2.jpg',
      alt: 'Scented Glow collection',
      link: '/shop/coffee-pods',
    },
    {
      title: 'Silk Essence',
      description: 'Pure fragrance oils',
      image: '/featured_3.jpg',
      alt: 'Silk Essence collection',
      link: '/shop/green-coffee',
    },
    {
      title: 'Velvet Touch',
      description: 'Soft cashmere throws',
      image: '/featured_4.jpg',
      alt: 'Velvet Touch collection',
      link: '/shop/velvet-blend',
    },
  ];
}
