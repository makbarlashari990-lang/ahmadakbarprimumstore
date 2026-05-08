import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowRight, CheckCircle2, ShoppingBag, Leaf, Droplets, UtensilsCrossed } from 'lucide-react';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { CATEGORIES, MOCK_PRODUCTS } from '../../constants';
import { ProductCard, CategoryCard } from '../../components/ui/Cards';
import { cn, formatPrice } from '../../lib/utils';
import type { Product } from '../../types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchHomeProducts() {
      try {
        const q = query(collection(db, 'products'), limit(8));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (fetched.length === 0) {
          setProducts(MOCK_PRODUCTS);
          setBestSellers(MOCK_PRODUCTS.filter(p => p.isBestSeller));
        } else {
          setProducts(fetched);
          setBestSellers(fetched.filter(p => p.isBestSeller));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(MOCK_PRODUCTS);
        setBestSellers(MOCK_PRODUCTS.filter(p => p.isBestSeller));
      }
    }
    fetchHomeProducts();
  }, []);

  return (
    <div className="flex flex-col bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center pt-32 lg:pt-0">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2000" 
            alt="Organic Table" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-cream/30"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-7xl font-display font-black leading-[1.1] mb-8 text-brand-brown">
              Foods that nourish as well as <span className="text-brand-yellow drop-shadow-sm">heal</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-brown/70 mb-12 leading-relaxed font-bold max-w-md">
              We bring you 100% Traditional Bilona Method Ghee and Pure Honey directly from nature.
            </p>
            <a href="/shop" className="daivik-button inline-flex items-center gap-3">
              SHOP NOW <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 bg-cream/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: 'Farm Fresh', icon: <Leaf className="w-8 h-8" />, color: 'bg-green-100' },
                { label: 'Pure Organic', icon: <Droplets className="w-8 h-8" />, color: 'bg-blue-100' },
                { label: 'Village Sourced', icon: <UtensilsCrossed className="w-8 h-8" />, color: 'bg-orange-100' },
                { label: 'Chemical Free', icon: <CheckCircle2 className="w-8 h-8" />, color: 'bg-yellow-100' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-6 group">
                   <div className={cn("w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                      {item.icon}
                   </div>
                   <h3 className="font-display font-black text-xs uppercase tracking-[0.2em] text-brand-brown">{item.label}</h3>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Holistic Wellness Section */}
      <section className="py-32">
         <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1547462539-80bcc39a3f2d?q=80&w=1000" 
                  alt="Natural Honey" 
                  className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700" 
                />
            </div>
            <div className="lg:w-1/2 space-y-10">
               <h2 className="text-4xl md:text-6xl font-display font-black text-brand-brown leading-tight">
                 Natural foods for your <span className="text-brand-yellow">holistic wellness</span>
               </h2>
               <p className="text-lg text-brand-brown/60 leading-relaxed font-medium">
                 Daivik was founded with a dream of providing organic foods which are pure, ethical and local. We represent a movement for a healthier lifestyle, connecting you back to your roots.
               </p>
               <div className="grid grid-cols-2 gap-8 pt-6">
                 {[
                   { label: '1000+', sub: 'Families Served' },
                   { label: '50+', sub: 'Organic Products' },
                 ].map((stat, i) => (
                   <div key={i} className="border-l-4 border-brand-yellow pl-6">
                      <h4 className="text-3xl font-display font-black text-brand-brown">{stat.label}</h4>
                      <p className="text-[10px] uppercase tracking-widest font-black text-brand-brown/40">{stat.sub}</p>
                   </div>
                 ))}
               </div>
               <a href="/shop" className="inline-flex items-center gap-2 text-brand-brown font-black uppercase text-xs tracking-widest border-b-2 border-brand-yellow pb-2 hover:text-brand-yellow transition-colors">
                  Learn Our Story
               </a>
            </div>
         </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="text-center mb-20 space-y-4">
              <span className="text-brand-yellow text-xs font-black uppercase tracking-[0.4em]">Our Collections</span>
              <h2 className="text-4xl md:text-6xl font-display font-black text-brand-brown">Treasures of the Soil</h2>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {CATEGORIES.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
           </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                 <span className="text-brand-yellow text-xs font-black uppercase tracking-[0.4em] mb-4 block">Shop Khalis</span>
                 <h2 className="text-4xl md:text-6xl font-display font-black text-brand-brown">Customer Favorites</h2>
              </div>
              <a href="/shop" className="daivik-button">View All Products</a>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials Banner */}
      <section className="py-32 bg-brand-brown text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-20 opacity-5">
            <Quote className="w-96 h-96" />
         </div>
         <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
            <Quote className="w-16 h-16 text-brand-yellow mx-auto mb-12 opacity-50" />
            <p className="text-2xl md:text-4xl font-display font-medium leading-relaxed mb-16 italic">
              "Lashari Organic has changed how we look at food. Their Desi Ghee is just like what my grandmother used to make. Pure, aromatic and truly khalis."
            </p>
            <div className="flex flex-col items-center">
               <div className="w-20 h-20 rounded-full bg-brand-yellow mb-4 border-4 border-white/10 overflow-hidden">
                  <img src="https://i.pravatar.cc/100?u=arsalan" className="w-full h-full object-cover" />
               </div>
               <h4 className="font-display font-black uppercase tracking-tighter text-xl text-brand-yellow">Arsalan Lashari</h4>
               <p className="text-[10px] uppercase tracking-widest font-black opacity-40">Verified Customer</p>
            </div>
         </div>
      </section>

      {/* Newsletter */}
      <section className="py-32">
         <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-4xl font-display font-black text-brand-brown">Join the Organic Family</h2>
            <p className="text-brand-brown/60 font-bold text-sm uppercase tracking-widest">Subscribe to receive healthy tips and farm updates.</p>
            <div className="flex p-2 bg-cream rounded-full border border-brand-yellow/20 shadow-xl">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="flex-1 px-8 py-3 bg-transparent border-none outline-none font-bold text-sm" 
               />
               <button className="bg-brand-yellow text-dark px-10 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
                  Join Now
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
