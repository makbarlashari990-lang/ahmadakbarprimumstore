import { useState } from 'react';
import { ShoppingBag, ChevronRight, CheckCircle2, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../../lib/firebase';
import { useCart } from '../../hooks/useCart';
import { formatPrice, cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

type Step = 'shipping' | 'payment' | 'success';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('shipping');
  const [isPlacing, setIsPlacing] = useState(false);
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
      <div className="pt-40 text-center pb-20">
        <h2 className="text-2xl font-display font-bold uppercase mb-4">Your cart is empty</h2>
        <a href="/shop" className="text-gold uppercase tracking-widest text-xs font-bold border-b border-gold pb-1">Return to Shop</a>
      </div>
    );
  }

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please sign in to place an order');
      return;
    }
    
    setIsPlacing(true);
    try {
      const orderData = {
        userId: user.uid,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customDesign: item.customDesign || null
        })),
        totalAmount: totalPrice,
        status: 'Pending',
        paymentMethod,
        shippingAddress: formData,
        createdAt: Date.now(), // rules check createdAt as request.time.toMillis() usually but I used number in blueprint
        serverTimestamp: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setStep('success');
      clearCart();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col lg:row gap-12">
        {/* Checkout Steps */}
        <div className="flex-1 space-y-12">
          {/* Progress Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className={cn("flex items-center gap-2", step === 'shipping' ? "text-gold" : "text-neutral-400")}>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Shipping</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-200" />
            <div className={cn("flex items-center gap-2", step === 'payment' ? "text-gold" : "text-neutral-400")}>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Payment</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-200" />
            <div className={cn("flex items-center gap-2", step === 'success' ? "text-gold" : "text-neutral-400")}>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Done</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.form 
                key="shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmitShipping} 
                className="space-y-6"
              >
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-8">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-neutral-100 p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-white border border-neutral-100 p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                      placeholder="e.g. 0300 1234567"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-white border border-neutral-100 p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Address</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-white border border-neutral-100 p-4 text-sm focus:ring-1 focus:ring-gold outline-none resize-none" 
                    placeholder="Street address, house number, area..."
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">City</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-white border border-neutral-100 p-4 text-sm focus:ring-1 focus:ring-gold outline-none" 
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full md:w-fit bg-premium-black text-white px-12 py-5 uppercase text-xs font-bold tracking-[0.3em] hover:bg-gold transition-colors"
                >
                  Continue to Payment
                </button>
              </motion.form>
            )}

            {step === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-8">Payment Method</h2>
                <div className="space-y-4">
                  {[
                    { id: 'COD', label: 'Cash on Delivery', description: 'Pay with cash upon delivery' },
                    { id: 'JazzCash', label: 'JazzCash', description: 'Secure payment via JazzCash mobile account' },
                    { id: 'EasyPaisa', label: 'EasyPaisa', description: 'Fast payment via EasyPaisa mobile account' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={cn(
                        "w-full flex items-start gap-4 p-6 border transition-all text-left",
                        paymentMethod === method.id ? "border-gold bg-gold/5" : "border-neutral-100 hover:border-gold/30"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0",
                        paymentMethod === method.id ? "border-gold" : "border-neutral-200"
                      )}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-gold rounded-full" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm uppercase tracking-tight">{method.label}</div>
                        <p className="text-xs text-neutral-400 mt-1">{method.description}</p>
                      </div>
                      <CreditCard className="w-5 h-5 ml-auto text-neutral-200" />
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep('shipping')}
                    className="px-8 py-5 uppercase text-xs font-bold tracking-[0.2em] border border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-gold text-white px-12 py-5 uppercase text-xs font-bold tracking-[0.3em] hover:bg-premium-black transition-colors"
                  >
                    Place Order {formatPrice(totalPrice)}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 space-y-8"
              >
                <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto text-white shadow-xl">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold uppercase tracking-tight mb-2">Order Confirmed!</h2>
                  <p className="text-neutral-500 max-w-sm mx-auto">Thank you for shopping at Ahmad Akbar Premium Store. Your order #PRM-58291 has been placed successfully.</p>
                </div>
                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                   <a href="/" className="bg-premium-black text-white py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-gold transition-colors">Continue Shopping</a>
                   <a href="/admin" className="text-gold text-xs font-bold uppercase tracking-widest hover:underline">Track My Order</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {step !== 'success' && (
          <aside className="w-full lg:w-96 space-y-8">
            <div className="bg-white p-8 luxury-card sticky top-32">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400 mb-8 pb-4 border-b border-neutral-100">Order Summary</h3>
              <div className="space-y-6 max-h-[40vh] overflow-y-auto mb-8 pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-neutral-50 flex-shrink-0 overflow-hidden">
                       <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 py-1">
                       <h4 className="text-[10px] font-bold uppercase truncate">{item.name}</h4>
                       <p className="text-[10px] text-neutral-400 mt-1">Qty: {item.quantity}</p>
                       <span className="text-[10px] font-bold text-gold block mt-2">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-6 border-t border-neutral-100">
                <div className="flex justify-between text-xs text-neutral-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-display font-bold uppercase pt-4">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-neutral-100 space-y-4">
                 <div className="flex items-center gap-3 text-neutral-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold tracking-widest">Secure Checkout</span>
                 </div>
                 <div className="flex items-center gap-3 text-neutral-400">
                    <Truck className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-bold tracking-widest">Insurance Included</span>
                 </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
