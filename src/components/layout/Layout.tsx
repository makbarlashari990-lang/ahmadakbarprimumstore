import { motion } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, X, Heart, Phone, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  onCartClick: () => void;
}

export function Navbar({ onCartClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useAuth();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled ? "bg-white/90 backdrop-blur-md py-3 border-neutral-200 shadow-sm" : "bg-transparent py-5 border-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a href="/" className="text-sm font-medium hover:text-gold transition-colors">Home</a>
          <a href="/shop" className="text-sm font-medium hover:text-gold transition-colors">Shop</a>
          <a href="/categories" className="text-sm font-medium hover:text-gold transition-colors">Categories</a>
        </div>

        <a href="/" className="flex flex-col items-center">
          <span className="text-xl md:text-2xl font-display font-bold tracking-tighter uppercase">Akbar</span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gold -mt-1 font-semibold">Premium Store</span>
        </a>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="hidden md:block hover:text-gold transition-colors">
            <Search className="w-5 h-5" />
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <a href="/admin" className="hover:text-gold transition-colors">
                <img src={user.photoURL || ''} alt="User" className="w-6 h-6 rounded-full border border-gold" />
              </a>
              <button onClick={handleLogout} className="hover:text-gold transition-colors hidden md:block">
                <LogOut className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="hover:text-gold transition-colors flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              <span className="hidden md:block text-[10px] uppercase font-bold tracking-widest">Login</span>
            </button>
          )}

          <button 
            onClick={onCartClick}
            className="relative hover:text-gold transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white lg:hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <span className="font-display font-bold">AKBAR PREMIUM</span>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col p-6 gap-6">
            <a href="/" className="text-2xl font-display" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="/shop" className="text-2xl font-display" onClick={() => setIsMobileMenuOpen(false)}>Shop</a>
            <a href="/categories" className="text-2xl font-display" onClick={() => setIsMobileMenuOpen(false)}>Categories</a>
            <a href="/track-order" className="text-2xl font-display" onClick={() => setIsMobileMenuOpen(false)}>Track Order</a>
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <h3 className="font-display font-bold text-xl mb-6">AKBAR PREMIUM</h3>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            Premium Home Essentials for the modern lifestyle. Quality products, trusted services, and elegant designs.
          </p>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center hover:bg-gold hover:border-gold transition-all">
               <Phone className="w-4 h-4" />
             </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-gold uppercase text-xs tracking-widest">Quick Links</h4>
          <ul className="space-y-4 text-sm text-neutral-400">
            <li><a href="/shop" className="hover:text-white transition-colors">All Products</a></li>
            <li><a href="/custom-design" className="hover:text-white transition-colors">Custom Design</a></li>
            <li><a href="/track-order" className="hover:text-white transition-colors">Order Tracking</a></li>
            <li><a href="/admin" className="hover:text-white transition-colors">Admin Login</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gold uppercase text-xs tracking-widest">Customer Service</h4>
          <ul className="space-y-4 text-sm text-neutral-400">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Return & Refund</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gold uppercase text-xs tracking-widest">Newsletter</h4>
          <p className="text-neutral-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-neutral-800 border-none px-4 py-2 text-sm flex-1 focus:ring-1 focus:ring-gold outline-none"
            />
            <button className="bg-gold px-4 py-2 text-sm font-bold uppercase tracking-widest whitespace-nowrap">Join</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-neutral-800 flex flex-col md:row items-center justify-between gap-4 text-xs text-neutral-500 uppercase tracking-widest">
        <p>&copy; 2026 Ahmad Akbar Premium Store. All rights reserved.</p>
        <div className="flex gap-6">
          <span>JazzCash</span>
          <span>EasyPaisa</span>
          <span>COD</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/923000000000" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
    >
      <Phone className="w-6 h-6" />
    </a>
  );
}
