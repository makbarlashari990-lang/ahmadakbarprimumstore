import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer, WhatsAppButton } from './components/layout/Layout';
import { CartDrawer } from './components/layout/CartDrawer';
import Home from './pages/home/Home';
import CustomDesign from './pages/CustomDesign';
import Shop from './pages/store/Shop';
import AdminDashboard from './pages/admin/AdminDashboard';
import Checkout from './pages/checkout/Checkout';
import Categories from './pages/Categories';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/custom-design" element={<CustomDesign />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
