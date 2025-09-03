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
}

export interface CartItem extends ProductSummary {
  quantity: number;
  selectedColor?: string;
}
