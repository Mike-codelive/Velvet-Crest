export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  image: string;
  colors: string[];
  company: string;
  description: string;
  category: string;
  featured: boolean;
  shipping: boolean;
  quantity?: number;
  stock?: number;
  stars?: number;
  reviews?: number;
  images?: ProductImage[];
}

export interface ProductColor {
  hex: string;
  name: string;
}

export interface CartItem extends ProductSummary {
  quantity: number;
  selectedColor?: string;
  isSubscribed?: boolean;
  giftWrap?: boolean;
  adjustedPrice?: number;
  subscriptionPlan?: string; // Add subscription plan
}
