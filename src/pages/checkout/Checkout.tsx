import { useState } from 'react';
import { ShoppingBag, ChevronRight, CheckCircle2, ShieldCheck, Truck, CreditCard, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useCart } from '../../hooks/useCart';
import { formatPrice, cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

type Step = 'shipping' | 'payment' | 'success';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'JazzCash' | 'EasyPaisa'>('COD');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="pt-48 text-center pb-20">
        <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-yellow/20">
           <ShoppingBag className="w-8 h-8 text-brand-yellow" />
        </div>
        <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-4 text-brand-brown">Your cart is empty</h2>
        <p className="text-neutral-400 mb-10 max-w-sm mx-auto font-medium">Browse our organic collection and add some pure tradition to your cart.</p>
        <a href="/shop" className="daivik-button">Go to Shop</a>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please sign in with Google to place an order.');
      return;
    }
    
    try {
      const orderData = {
        userId: user.uid,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: totalPrice,
        status: 'Pending',
        paymentMethod,
        shippingAddress: formData,
        createdAt: Date.now()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setStep('success');
      clearCart();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      alert('Failed to place order. Please check your connection.');
    }
  };

  return (
    <div className="pt-40 pb-20 max-w-7xl mx-auto px-4 md:px-8 overflow-x-hidden">
      <div className="flex flex-col lg:row gap-20">
        {/* Checkout Steps */}
        <div className="flex-1">
          {/* Progress Header */}
          <div className="flex items-center gap-6 mb-20 bg-cream p-6 rounded-3xl border border-brand-yellow/10">
            <div className={cn("flex items-center gap-3", step === 'shipping' ? "text-brand-brown" : "text-neutral-300")}>
              <span className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black", step === 'shipping' ? "border-brand-yellow bg-brand-yellow text-white" : "border-neutral-200")}>1</span>
              <span className="text-[10px] uppercase font-black tracking-widest">Address</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-200" />
            <div className={cn("flex items-center gap-3", step === 'payment' ? "text-brand-brown" : "text-neutral-300")}>
              <span className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black", step === 'payment' ? "border-brand-yellow bg-brand-yellow text-white" : "border-neutral-200")}>2</span>
              <span className="text-[10px] uppercase font-black tracking-widest">Payment</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-200" />
            <div className={cn("flex items-center gap-3", step === 'success' ? "text-brand-brown" : "text-neutral-300")}>
              <span className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black", step === 'success' ? "border-brand-yellow bg-brand-yellow text-white" : "border-neutral-200")}>3</span>
              <span className="text-[10px] uppercase font-black tracking-widest">Order Done</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.form 
                key="shipping"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                onSubmit={(e) => { e.preventDefault(); setStep('payment'); }} 
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-10">
                   <Leaf className="w-6 h-6 text-brand-yellow" />
                   <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter text-brand-brown">Delivery Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-neutral-400 tracking-[0.2em] ml-2">Receiver's Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-brand-yellow/10 p-5 rounded-2xl text-sm focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm" 
                      placeholder="e.g. Akbar Lashari"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-neutral-400 tracking-[0.2em] ml-2">Active WhatsApp / Phone</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-white border border-gold/10 p-5 rounded-2xl text-sm focus:ring-2 focus:ring-gold outline-none shadow-sm" 
                      placeholder="e.g. 0300 0000000"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-neutral-400 tracking-[0.2em] ml-2">Email for Track Notification</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-white border border-gold/10 p-5 rounded-2xl text-sm focus:ring-2 focus:ring-gold outline-none shadow-sm" 
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-neutral-400 tracking-[0.2em] ml-2">Detailed Shipping Address</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-white border border-gold/10 p-5 rounded-2xl text-sm focus:ring-2 focus:ring-gold outline-none shadow-sm resize-none" 
                    placeholder="House No, Street, Area, Landmarks..."
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-neutral-400 tracking-[0.2em] ml-2">City</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-white border border-gold/10 p-5 rounded-2xl text-sm focus:ring-2 focus:ring-gold outline-none shadow-sm" 
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-organic-green text-gold px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-organic-green/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Proceed to Payment Selection
                </button>
              </motion.form>
            )}

            {step === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-3 mb-10">
                   <CreditCard className="w-6 h-6 text-gold" />
                   <h2 className="text-4xl font-display font-black uppercase tracking-tighter text-organic-green">Payment <span className="text-gold italic font-light lowercase">Choice</span></h2>
                </div>

                <div className="grid gap-6">
                  {[
                    { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when products arrive at your door.', icon: '🚚' },
                    { id: 'JazzCash', label: 'JazzCash Mobile Account', desc: '03XX-XXXXXXX - Fast & Secure', icon: '📱' },
                    { id: 'EasyPaisa', label: 'EasyPaisa Mobile Account', desc: '03XX-XXXXXXX - Easy Payments', icon: '💎' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={cn(
                        "w-full flex items-center gap-6 p-8 rounded-[2rem] border-2 transition-all text-left group",
                        paymentMethod === method.id 
                        ? "border-brand-yellow bg-brand-yellow/5 shadow-xl shadow-brand-yellow/5" 
                        : "border-neutral-50 bg-neutral-50/50 hover:border-brand-yellow/30"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-full border-4 flex items-center justify-center flex-shrink-0 transition-all",
                        paymentMethod === method.id ? "border-brand-yellow bg-brand-brown" : "border-neutral-200 bg-white"
                      )}>
                        {paymentMethod === method.id && <div className="w-2 h-2 bg-brand-yellow rounded-full" />}
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center text-3xl bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        {method.icon}
                      </div>
                      <div>
                        <div className="font-black text-sm uppercase tracking-tight text-organic-green">{method.label}</div>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">{method.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 pt-10">
                  <button 
                    onClick={() => setStep('shipping')}
                    className="md:w-1/3 py-6 rounded-2xl font-black uppercase text-xs tracking-widest border-2 border-gold/10 text-neutral-400 hover:text-gold hover:bg-gold/5 transition-all text-center"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-brand-yellow text-dark py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-brand-yellow/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
                  >
                    Confirm Khalis Order ({formatPrice(totalPrice)})
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-cream rounded-[4rem] border border-gold/10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                   <img src="https://www.transparenttextures.com/patterns/leaf.png" className="w-full h-full" />
                </div>
                <div className="w-24 h-24 organic-gradient rounded-full flex items-center justify-center mx-auto text-gold shadow-2xl shadow-gold/20 mb-10 relative z-10">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-5xl font-display font-black uppercase tracking-tighter mb-4 text-organic-green">Order Received!</h2>
                  <p className="text-neutral-500 font-medium max-w-sm mx-auto mb-12">Congratulations! Your request for pure organic products has been recorded. Our team will contact you shortly on WhatsApp.</p>
                  
                  <div className="flex flex-col gap-4 max-w-xs mx-auto">
                     <a href="/" className="bg-organic-green text-gold py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all">Keep Shopping</a>
                     <p className="text-[10px] text-gold font-black uppercase tracking-[0.3em]">Brought to you by Lashari Organic Mart</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {step !== 'success' && (
          <aside className="w-full lg:w-[400px]">
            <div className="bg-white p-10 rounded-[3rem] border border-gold/10 shadow-2xl shadow-gold/5 sticky top-32">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-gold mb-10 pb-4 border-b border-gold/5">Your Fresh Basket</h3>
              
              <div className="space-y-6 max-h-[35vh] overflow-y-auto mb-10 pr-4 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-neutral-50 rounded-2xl overflow-hidden p-1 border border-gold/5">
                       <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 py-1">
                       <h4 className="text-[11px] font-black uppercase tracking-tight text-organic-green line-clamp-1">{item.name}</h4>
                       <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Qty: {item.quantity}</span>
                          <span className="text-[11px] font-black text-gold">{formatPrice(item.price * item.quantity)}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 pt-8 border-t-2 border-dashed border-gold/10">
                <div className="flex justify-between text-[11px] text-neutral-400 font-black uppercase tracking-widest">
                  <span>Bag Total</span>
                  <span className="text-neutral-800">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-400 font-black uppercase tracking-widest">
                  <span>Farm Delivery</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-display font-black uppercase pt-6 text-organic-green">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-gold/5 rounded-2xl space-y-4">
                 <div className="flex items-center gap-3 text-gold">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-black tracking-widest">100% Purity Guaranteed</span>
                 </div>
                 <div className="flex items-center gap-3 text-gold">
                    <Truck className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-black tracking-widest">Village to Doorstep</span>
                 </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
