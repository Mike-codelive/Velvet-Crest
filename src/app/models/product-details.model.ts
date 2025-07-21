import { ProductImage } from './image.model';

export interface ProductDetails {
  id: string;
  name: string;
  price: number;
  company: string;
  colors: string[];
  description: string;
  category: string;
  shipping: boolean;
  featured: boolean;
  stock: number;
  stars: number;
  reviews: number;
  images: ProductImage[];
}
