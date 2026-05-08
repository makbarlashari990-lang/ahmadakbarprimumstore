import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice, cn } from '../../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-organic-green/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream z-[101] flex flex-col shadow-2xl rounded-l-[3rem] border-l border-gold/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-gold/5 flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-2xl uppercase tracking-tighter text-organic-green">Your Basket</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-black">{totalItems} Khalis items</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-white/50 hover:bg-gold hover:text-organic-green rounded-full transition-all text-organic-green"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 border border-gold/10 shadow-lg">
                    <ShoppingBag className="w-10 h-10 text-gold" />
                  </div>
                  <h3 className="font-black text-xl mb-4 uppercase tracking-tighter text-organic-green">Basket is Empty</h3>
                  <p className="text-neutral-400 text-sm mb-10 max-w-[240px] font-medium leading-relaxed">It seems you haven't picked any pure organic treasures yet.</p>
                  <button 
                    onClick={onClose}
                    className="bg-gold text-organic-green px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-gold/20 active:scale-95 transition-all"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}`} className="flex gap-6 group">
                    <div className="w-24 h-24 bg-white rounded-2xl flex-shrink-0 overflow-hidden relative border border-gold/10 p-1 shadow-sm">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 py-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-black uppercase tracking-tight text-organic-green line-clamp-1 pr-4">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gold font-bold uppercase tracking-widest mb-4 italic">Fresh Harvest</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center bg-white rounded-xl border border-gold/10 p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-3 hover:text-gold transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black w-6 text-center text-organic-green">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-3 hover:text-gold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-black text-organic-green text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-10 bg-white rounded-t-[3rem] shadow-2xl border-t border-gold/5 space-y-8">
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-[11px] text-neutral-400 font-black uppercase tracking-[0.2em]">
                     <span>Subtotal</span>
                     <span className="text-organic-green">{formatPrice(totalPrice)}</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px] text-neutral-400 font-black uppercase tracking-[0.2em]">
                     <span>Village Delivery</span>
                     <span className="text-green-600">FREE</span>
                   </div>
                   <div className="pt-6 border-t border-gold/5 flex items-center justify-between">
                     <span className="font-display font-black uppercase text-organic-green">Total</span>
                     <span className="text-3xl font-display font-black text-gold">{formatPrice(totalPrice)}</span>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <a 
                    href="/checkout" 
                    onClick={onClose}
                    className="w-full bg-organic-green text-gold py-6 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-organic-green/20 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                     Order Khalis Items <ArrowRight className="w-4 h-4" />
                   </a>
                   <div className="flex items-center justify-center gap-6 py-2 opacity-30 group">
                     <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-gold" />
                        <span className="text-[8px] uppercase font-black tracking-widest">Secure</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Leaf className="w-3 h-3 text-gold" />
                        <span className="text-[8px] uppercase font-black tracking-widest">100% Organic</span>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
