import type { Product, Review, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'desi-ghee', name: 'Desi Ghee', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=500' },
  { id: 'pure-honey', name: 'Pure Honey', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=500' },
  { id: 'dry-fruits', name: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1596501048741-86080e2d5624?q=80&w=500' },
  { id: 'organic-spices', name: 'Organic Spices', image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=500' },
  { id: 'herbal-products', name: 'Herbal Products', image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=500' },
  { id: 'traditional-foods', name: 'Traditional Foods', image: 'https://images.unsplash.com/photo-1504107819100-db4567d60670?q=80&w=500' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'desi-ghee-premium',
    name: 'Grass-Fed Pure Desi Ghee',
    description: '100% Traditional Bilona Method Ghee made from grass-fed cow milk in small batches.',
    price: 3500,
    originalPrice: 4200,
    category: 'Desi Ghee',
    images: ['https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=500'],
    rating: 4.9,
    reviewsCount: 124,
    stock: 50,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleEndTime: Date.now() + 86400000,
    createdAt: Date.now(),
    tags: ['Organic', 'Halal', 'Farm Fresh']
  },
  {
    id: 'sidr-honey',
    name: 'Wild Sidr Honey (Berri)',
    description: 'Premium organic honey extracted from the blossoms of Sidr trees in KP regions.',
    price: 2800,
    originalPrice: 3200,
    category: 'Pure Honey',
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=500'],
    rating: 4.8,
    reviewsCount: 89,
    stock: 30,
    isBestSeller: true,
    createdAt: Date.now(),
    tags: ['KP Organic', 'Raw']
  },
  {
    id: 'mixed-dry-fruits',
    name: 'Gilgit Premium Dry Fruits Mix',
    description: 'A rich blend of Walnuts, Almonds, Pistachios, and Cashews from Gilgit-Baltistan.',
    price: 2200,
    originalPrice: 2500,
    category: 'Dry Fruits',
    images: ['https://images.unsplash.com/photo-1596501048741-86080e2d5624?q=80&w=500'],
    rating: 4.7,
    reviewsCount: 210,
    stock: 100,
    isFlashSale: true,
    flashSaleEndTime: Date.now() + 18000000,
    createdAt: Date.now(),
  },
  {
    id: 'organic-mustard-oil',
    name: 'Cold Pressed Mustard Oil',
    description: '100% pure cold-pressed sarson ka tail without any additives or preservatives.',
    price: 850,
    originalPrice: 1000,
    category: 'Organic Oil',
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=500'],
    rating: 4.9,
    reviewsCount: 56,
    stock: 45,
    isBestSeller: true,
    createdAt: Date.now(),
  }
];
