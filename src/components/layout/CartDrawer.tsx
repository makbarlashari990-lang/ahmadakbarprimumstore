import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/utils';
import { cn } from '../../lib/utils';

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
            className="fixed inset-0 bg-black/40 z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl uppercase tracking-tight">Shopping Cart</h2>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">{totalItems} items selected</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-neutral-50 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-neutral-300" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 uppercase tracking-tighter">Your cart is empty</h3>
                  <p className="text-neutral-500 text-sm mb-8 max-w-[240px]">Looks like you haven't added any premium items yet.</p>
                  <button 
                    onClick={onClose}
                    className="bg-premium-black text-white px-10 py-4 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-gold transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.customDesign}`} className="flex gap-4 group">
                    <div className="w-24 h-32 bg-neutral-50 flex-shrink-0 overflow-hidden relative">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      {item.customDesign && (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                           <img src={item.customDesign} className="w-full h-full object-contain mix-blend-multiply opacity-70" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 py-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold uppercase truncate pr-4">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-400 mb-4">{item.category}</p>
                      
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center border border-neutral-100">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-neutral-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-neutral-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-display font-bold text-premium-black">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-neutral-50 space-y-6">
                <div className="space-y-2">
                   <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest">
                     <span>Subtotal</span>
                     <span>{formatPrice(totalPrice)}</span>
                   </div>
                   <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest">
                     <span>Shipping</span>
                     <span className="text-gold font-bold">Calculated at checkout</span>
                   </div>
                   <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                     <span className="font-display font-bold uppercase">Total</span>
                     <span className="text-2xl font-display font-bold text-gold">{formatPrice(totalPrice)}</span>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <a 
                    href="/checkout" 
                    onClick={onClose}
                    className="w-full bg-premium-black text-white py-5 uppercase text-xs font-bold tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gold transition-colors"
                   >
                     Checkout Securely <ArrowRight className="w-4 h-4" />
                   </a>
                   <div className="flex items-center justify-center gap-4 py-2 opacity-50 grayscale">
                     <ShieldCheck className="w-4 h-4" />
                     <span className="text-[9px] uppercase font-bold tracking-widest">Secure Payments</span>
                     <Truck className="w-4 h-4 ml-4" />
                     <span className="text-[9px] uppercase font-bold tracking-widest">Fast Delivery</span>
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
