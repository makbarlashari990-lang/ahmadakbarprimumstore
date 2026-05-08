import { motion } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, X, Heart, Phone, LogIn, LogOut, ArrowRight } from 'lucide-react';
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
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-white",
      isScrolled ? "py-2 border-neutral-100 shadow-md" : "py-4 border-transparent shadow-sm"
    )}>
      {/* Top Bar like Daivik */}
      <div className="bg-brand-brown text-[10px] text-white py-2 text-center font-bold tracking-widest uppercase hidden md:block">
        Worldwide Shipping Available | Free Delivery on Orders Above PKR 5,000
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between mt-2">
        <div className="flex items-center gap-4 lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-brand-brown" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <a href="/" className="text-[11px] font-extrabold uppercase tracking-widest text-brand-brown hover:text-brand-yellow transition-colors">Home</a>
          <a href="/shop" className="text-[11px] font-extrabold uppercase tracking-widest text-brand-brown hover:text-brand-yellow transition-colors">Our Story</a>
          <div className="group relative">
            <a href="/shop" className="text-[11px] font-extrabold uppercase tracking-widest text-brand-brown hover:text-brand-yellow transition-colors flex items-center gap-1">
              Organic Shop
            </a>
          </div>
        </div>

        <a href="/" className="flex flex-col items-center group">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
              <span className="text-white font-black text-xl">L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-display font-black tracking-tighter uppercase leading-none text-brand-yellow">LASHARI</span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-brand-brown font-black">Organic Mart</span>
            </div>
          </div>
        </a>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center bg-neutral-50 px-4 py-2 rounded-full border border-neutral-100 group">
             <input type="text" placeholder="Search" className="bg-transparent text-[11px] border-none outline-none w-24 group-focus-within:w-40 transition-all font-bold" />
             <Search className="w-4 h-4 text-neutral-300 group-hover:text-brand-yellow cursor-pointer" />
          </div>

          <button 
            onClick={onCartClick}
            className="bg-brand-yellow text-dark px-6 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-brand-yellow/20 hover:scale-105 active:scale-95 transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-3 -right-3 bg-brand-brown text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Cart</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#f0ece4] text-brand-brown pt-20 pb-10 border-t border-brand-yellow/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <h3 className="font-display font-black text-2xl tracking-tighter uppercase text-brand-yellow">Lashari<span className="text-brand-brown">Organic</span></h3>
          <p className="text-brand-brown/60 text-xs leading-relaxed font-bold">
            Because every one of us deserves a healthy balanced life. 100% Traditional Bilona Method Ghee and Pure Honey directly from the heart of Pakistan.
          </p>
          <div className="flex gap-4">
             {['fb', 'tw', 'ig', 'yt'].map(icon => (
                <div key={icon} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-brand-yellow hover:text-white transition-all cursor-pointer text-[10px] font-black uppercase">{icon}</div>
             ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-extrabold mb-8 text-brand-brown uppercase text-[10px] tracking-widest border-b border-brand-yellow/20 pb-2">Links</h4>
          <ul className="space-y-4 text-[10px] font-extrabold uppercase tracking-widest text-brand-brown/60">
            <li><a href="/shop" className="hover:text-brand-yellow transition-colors">Our Story</a></li>
            <li><a href="/shop" className="hover:text-brand-yellow transition-colors">Recipes</a></li>
            <li><a href="/shop" className="hover:text-brand-yellow transition-colors">Blog</a></li>
            <li><a href="/shop" className="hover:text-brand-yellow transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold mb-8 text-brand-brown uppercase text-[10px] tracking-widest border-b border-brand-yellow/20 pb-2">Policies</h4>
          <ul className="space-y-4 text-[10px] font-extrabold uppercase tracking-widest text-brand-brown/60">
            <li><a href="/" className="hover:text-brand-yellow transition-colors">Track Order</a></li>
            <li><a href="/" className="hover:text-brand-yellow transition-colors">Privacy Policy</a></li>
            <li><a href="/" className="hover:text-brand-yellow transition-colors">Refund Policy</a></li>
            <li><a href="/" className="hover:text-brand-yellow transition-colors">Shipping Info</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-extrabold text-brand-brown uppercase text-[10px] tracking-widest border-b border-brand-yellow/20 pb-2">Newsletter</h4>
          <p className="text-brand-brown/60 text-[10px] font-bold uppercase tracking-widest">Get healthier and happier, naturally, with our organic foods.</p>
          <div className="flex bg-white p-1 rounded-full border border-brand-yellow/10 shadow-sm">
            <input 
              type="email" 
              placeholder="Email" 
              className="px-4 py-2 text-[10px] flex-1 bg-transparent border-none outline-none font-bold"
            />
            <button className="bg-brand-yellow text-white p-2 rounded-full hover:scale-110 transition-transform">
               <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20 pt-8 border-t border-brand-brown/10 flex flex-col md:row items-center justify-between gap-6 text-[9px] text-brand-brown/40 font-black uppercase tracking-[0.2em]">
        <p>&copy; 2026 Lashari Organic Mart. Pure Goodness of Taste.</p>
        <div className="flex gap-4">
           <span>Akbar Lashari Production</span>
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
