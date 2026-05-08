export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string; // Changed to string for flexibility with many organic categories
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  flashSaleEndTime?: number;
  customizable?: boolean;
  tags?: string[];
  createdAt: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
  customDesign?: string; // URL to uploaded design
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'COD' | 'JazzCash' | 'EasyPaisa';
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
  };
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}
