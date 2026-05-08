import { useState } from 'react';
import { Star, ShoppingCart, Eye, Heart, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Category } from '../../types';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  return (
    <>
    <motion.div 
      className="group bg-white rounded-2xl overflow-hidden border border-brand-yellow/10 transition-all duration-300 hover:shadow-xl p-4 flex flex-col text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative aspect-square overflow-hidden mb-6 bg-neutral-50 rounded-xl">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Quick View Button */}
        <button 
          onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-dark p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-yellow hover:text-white"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center">
        {/* Mock Variant Badges like Daivik */}
        <div className="flex gap-2 mb-4 justify-center">
           <span className="bg-brand-brown text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">1 KG PACK</span>
           <span className="bg-neutral-100 text-neutral-400 text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">2 KG PACK</span>
        </div>

        <h3 className="text-xs font-extrabold mb-3 text-brand-brown uppercase tracking-tight leading-tight min-h-[2.5rem] flex items-center justify-center">
          {product.name}
        </h3>

        <div className="mb-6 flex flex-col items-center gap-1">
          <span className="text-sm font-black text-brand-brown">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[10px] text-neutral-300 line-through font-medium">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <button 
          onClick={() => addItem(product)}
          className="w-full bg-brand-yellow text-dark font-black py-3 rounded-full text-[10px] uppercase tracking-widest shadow-md shadow-brand-yellow/10 hover:bg-brand-yellow/90 hover:scale-105 active:scale-95 transition-all"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>

    {/* Quick View Modal */}
    <AnimatePresence>
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsQuickViewOpen(false)}
            className="absolute inset-0 bg-brand-brown/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-4xl overflow-hidden shadow-2xl rounded-3xl flex flex-col md:flex-row"
          >
            <button 
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-cream/80 hover:bg-brand-yellow hover:text-white rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-full md:w-1/2 bg-neutral-50 aspect-square p-8">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-2xl shadow-xl" />
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col">
               <div className="flex items-center gap-4 mb-4">
                 <span className="text-brand-yellow uppercase tracking-[0.3em] text-[10px] font-black underline">In Stock Now</span>
                 <div className="flex gap-1 text-brand-yellow">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                 </div>
               </div>
               <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tighter mb-6 text-brand-brown">{product.name}</h2>
               <div className="flex items-center gap-4 mb-8">
                 <span className="text-3xl font-display font-black text-brand-brown font-extrabold">{formatPrice(product.price)}</span>
                 {product.originalPrice && (
                    <span className="text-xl text-neutral-300 line-through font-medium">{formatPrice(product.originalPrice)}</span>
                 )}
               </div>
               <p className="text-neutral-500 text-sm leading-relaxed mb-10 font-medium">{product.description}</p>
               
               <div className="mt-auto grid grid-cols-5 gap-3">
                  <button 
                    onClick={() => { addItem(product); setIsQuickViewOpen(false); }}
                    className="col-span-4 bg-brand-yellow text-dark py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-yellow/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <button className="col-span-1 border border-brand-yellow/20 rounded-full flex items-center justify-center text-brand-yellow hover:bg-brand-yellow/10 transition-all">
                    <Heart className="w-5 h-5" />
                  </button>
               </div>
               <div className="mt-6 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-neutral-300">
                  <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Certified Organic</div>
                  <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Village Sourced</div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.a 
      href={`/shop?category=${encodeURIComponent(category.name)}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative h-40 bg-white rounded-2xl border border-brand-yellow/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute inset-x-0 top-0 h-2/3 overflow-hidden">
         <img 
           src={category.image} 
           alt={category.name}
           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
         />
      </div>
      <div className="absolute bottom-0 inset-x-0 h-1/3 flex flex-col items-center justify-center px-4 bg-white">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-brand-brown group-hover:text-brand-yellow transition-colors text-center truncate w-full">
          {category.name}
        </h3>
      </div>
    </motion.a>
  );
}
