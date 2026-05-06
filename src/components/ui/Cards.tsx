import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Eye, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../../types';
import { cn, formatPrice, calculateDiscount } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const discount = product.originalPrice ? calculateDiscount(product.price, product.originalPrice) : 0;

  return (
    <>
    <motion.div 
      className="luxury-card group relative flex flex-col h-full bg-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-gold text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {discount}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              Best Seller
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 bg-black/5 flex items-center justify-center gap-2 p-4"
            >
              <button 
                onClick={() => addItem(product)}
                className="bg-white text-premium-black p-3 rounded-full hover:bg-gold hover:text-white transition-all shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsQuickViewOpen(true)}
                className="bg-white text-premium-black p-3 rounded-full hover:bg-gold hover:text-white transition-all shadow-lg"
              >
                <Eye className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={cn("w-3 h-3", i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-neutral-300")} />
          ))}
          <span className="text-[10px] text-neutral-400">({product.reviewsCount})</span>
        </div>
        
        <h3 className="text-xs md:text-sm font-medium mb-1 line-clamp-1 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-sm font-bold text-premium-black">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:row"
          >
            <button 
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-full md:w-1/2 bg-neutral-100 aspect-square md:aspect-auto">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
               <div className="flex items-center gap-2 mb-6">
                 <span className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold">In Stock</span>
               </div>
               <h2 className="text-3xl font-display font-bold uppercase tracking-tight mb-4">{product.name}</h2>
               <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
                 <span className="text-2xl font-display font-bold text-premium-black">{formatPrice(product.price)}</span>
                 {product.originalPrice && (
                    <span className="text-lg text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                 )}
               </div>
               <p className="text-neutral-500 text-sm leading-relaxed mb-8">{product.description}</p>
               
               <div className="mt-auto space-y-4">
                  <button 
                    onClick={() => { addItem(product); setIsQuickViewOpen(false); }}
                    className="w-full bg-premium-black text-white py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-gold transition-colors flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> 100% Original Product Guaranteed
                  </p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}

export function CategoryCard({ category }: { category: any }) {
  return (
    <motion.a 
      href={`/shop?category=${category.name}`}
      className="relative aspect-square md:aspect-[4/3] overflow-hidden group luxury-card"
      whileHover={{ y: -5 }}
    >
      <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 md:p-6">
        <h3 className="text-white font-display font-bold text-lg md:text-xl uppercase tracking-widest">{category.name}</h3>
        <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-widest mt-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          Explore <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </motion.a>
  );
}
