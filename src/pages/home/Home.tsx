import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, Quote } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { CATEGORIES, MOCK_PRODUCTS } from '../../constants';
import { ProductCard, CategoryCard } from '../../components/ui/Cards';
import { formatPrice } from '../../lib/utils';
import type { Product } from '../../types';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours in seconds
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchHomeProducts() {
      try {
        const q = query(collection(db, 'products'), limit(10));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (fetched.length === 0) {
          setProducts(MOCK_PRODUCTS);
          setBestSellers(MOCK_PRODUCTS.filter(p => p.isBestSeller));
          setFlashSaleProducts(MOCK_PRODUCTS.filter(p => p.isFlashSale));
        } else {
          setProducts(fetched);
          setBestSellers(fetched.filter(p => p.isBestSeller));
          setFlashSaleProducts(fetched.filter(p => p.isFlashSale));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
        setProducts(MOCK_PRODUCTS);
        setBestSellers(MOCK_PRODUCTS.filter(p => p.isBestSeller));
        setFlashSaleProducts(MOCK_PRODUCTS.filter(p => p.isFlashSale));
      }
    }
    fetchHomeProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { h: h.toString().padStart(2, '0'), m: m.toString().padStart(2, '0'), s: s.toString().padStart(2, '0') };
  };

  const { h, m, s } = formatTime(timeLeft);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-neutral-900">
        <img 
          src="https://images.unsplash.com/photo-1616489953149-75517454 application-quality/photo-1616489953149-755174549f8a?q=80&w=2000" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-neutral-900/40" />
        
        <div className="relative z-10 text-center px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold uppercase tracking-[0.4em] text-xs font-bold mb-6 block"
          >
            Exclusive Collection 2026
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-5xl md:text-8xl font-display font-bold tracking-tighter uppercase mb-8 leading-[0.9]"
          >
            Premium Home <br /> Essentials
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <a href="/shop" className="bg-gold text-white px-10 py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-white hover:text-premium-black transition-all">
              Shop Now
            </a>
            <a href="/custom-design" className="bg-transparent border border-white text-white px-10 py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-white hover:text-premium-black transition-all">
              Custom Designs
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Statistics */}
      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Original Products', value: '100%', sub: 'Guaranteed' },
            { label: 'Happy Customers', value: '10K+', sub: 'Worldwide' },
            { label: 'Delivery Time', value: '2-4', sub: 'Business Days' },
            { label: 'Customer Support', value: '24/7', sub: 'WhatsApp' },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-2xl md:text-3xl font-display font-bold text-premium-black mb-1 group-hover:text-gold transition-colors">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">{stat.label}</div>
              <div className="text-[9px] uppercase tracking-widest text-gold opacity-0 group-hover:opacity-100 transition-opacity">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-2 block">Departments</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight">Shop by Category</h2>
          </div>
          <a href="/categories" className="text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2 hover:text-gold transition-colors">
            View All Categories <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="py-20 bg-neutral-900 border-y border-gold/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full luxury-gradient opacity-20 skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <span className="bg-gold text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest mb-6 inline-block">
              Limited Time Offer
            </span>
            <h2 className="text-white text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-4">
              Premium Flash Sale
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md">
              Don't miss out on our exclusive selection of premium items at unbelievable prices. Only for a limited time.
            </p>
            
            <div className="flex justify-center md:justify-start gap-4">
              {[
                { label: 'Hours', value: h },
                { label: 'Minutes', value: m },
                { label: 'Seconds', value: s },
              ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-white/5 border border-white/10 w-16 md:w-20 h-16 md:h-20 flex items-center justify-center text-white text-3xl font-display font-bold mb-2">
                    {unit.value}
                  </div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full max-w-md grid grid-cols-2 gap-4">
            {flashSaleProducts.slice(0, 2).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-2 block">Curated Selection</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight">Best Sellers</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="gold-border text-premium-black px-12 py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-premium-black hover:text-white transition-all">
            Load More Products
          </button>
        </div>
      </section>

      {/* Reviews Slider */}
      <section className="py-20 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight mb-4">Customer Stories</h2>
            <div className="flex items-center justify-center gap-1 text-gold">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-premium-black text-sm font-bold ml-2">4.9/5 Average Rating</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-8 luxury-card relative group">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-neutral-100" />
                <div className="flex gap-1 text-gold mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                </div>
                <p className="text-neutral-600 text-sm italic leading-relaxed mb-6">
                  "Absolutely love the quality of the products! The shipping was incredibly fast and the packaging was premium. Will definitely shop again from Ahmad Akbar Premium Store."
                </p>
                <div className="grid grid-cols-2 gap-2 mb-8">
                   <img src={`https://picsum.photos/400/300?random=${i*10}`} alt="Review" className="w-full aspect-[4/3] object-cover" />
                   <img src={`https://picsum.photos/400/300?random=${i*11}`} alt="Review" className="w-full aspect-[4/3] object-cover" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Zaryab Khan</div>
                    <div className="text-[10px] text-gold uppercase font-bold tracking-widest">Verified Buyer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="py-8 bg-premium-black border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Jazz_Cash_Logo.png" alt="JazzCash" className="h-4 md:h-6 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Easypaisa_logo.png" alt="EasyPaisa" className="h-4 md:h-6 object-contain" />
          <div className="text-white text-[10px] font-bold tracking-[0.3em] uppercase">100% Original Products</div>
          <div className="text-white text-[10px] font-bold tracking-[0.3em] uppercase">Free Returns</div>
        </div>
      </section>
    </div>
  );
}
