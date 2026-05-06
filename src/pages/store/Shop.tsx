import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Grid3X3, Grid2X2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { CATEGORIES, MOCK_PRODUCTS } from '../../constants';
import { ProductCard } from '../../components/ui/Cards';
import { cn } from '../../lib/utils';
import type { Product } from '../../types';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        // If Firestore is empty, use mock products for now
        if (fetchedProducts.length === 0) {
          setProducts(MOCK_PRODUCTS);
        } else {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || p.category === selectedCategory;
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'popular') return b.rating - a.rating;
        return b.createdAt - a.createdAt;
      });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-2 block">Premium Collection</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Our Store</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-50 border border-neutral-100 pl-10 pr-4 py-3 placeholder:text-neutral-400 focus:ring-1 focus:ring-gold outline-none w-full md:w-64 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-gold" />
          </div>
          <button 
            onClick={() => setIsFilterSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 bg-premium-black text-white px-6 py-3 uppercase text-[10px] font-bold tracking-widest"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Desktop Filter Sidebar (Sticky) */}
        <aside className="hidden md:block w-64 space-y-12 h-fit sticky top-32">
          <section>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400 mb-6 flex items-center justify-between">
              Categories
              <ChevronDown className="w-3 h-3" />
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={cn("block text-sm transition-colors", !selectedCategory ? "text-gold font-bold" : "text-neutral-500 hover:text-premium-black")}
              >
                All Products
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name as any)}
                  className={cn("block text-sm transition-colors", selectedCategory === cat.name ? "text-gold font-bold" : "text-neutral-500 hover:text-premium-black")}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400 mb-6 flex items-center justify-between">
              Price Range
              <ChevronDown className="w-3 h-3" />
            </h3>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-gold bg-neutral-100"
              />
              <div className="flex items-center justify-between text-xs font-bold font-display">
                <span>PKR 0</span>
                <span className="text-gold">PKR {priceRange[1]}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400 mb-6">Sort By</h3>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-neutral-50 border border-neutral-100 p-3 text-sm focus:ring-1 focus:ring-gold outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </section>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
             <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">
               Showing {filteredProducts.length} Products
             </span>
             <div className="flex items-center gap-2">
               <button className="p-2 hover:bg-neutral-100 transition-colors text-premium-black">
                 <Grid3X3 className="w-4 h-4" />
               </button>
               <button className="p-2 hover:bg-neutral-100 transition-colors text-neutral-400">
                 <Grid2X2 className="w-4 h-4" />
               </button>
             </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-neutral-500 mb-6">No products found matching your criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); setPriceRange([0, 10000]); }}
                className="bg-premium-black text-white px-8 py-3 uppercase text-[10px] font-bold tracking-widest"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isFilterSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[101] p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="font-display font-bold text-xl uppercase">Filters</h2>
                <button onClick={() => setIsFilterSidebarOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              
              {/* Mobile Filter Content */}
              <div className="space-y-12">
                <section>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400 mb-6">Categories</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {['All Products', ...CATEGORIES.map(c => c.name)].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => { setSelectedCategory(cat === 'All Products' ? null : cat as any); setIsFilterSidebarOpen(false); }}
                        className={cn(
                          "px-6 py-3 border text-left text-xs uppercase font-bold tracking-widest",
                          (cat === 'All Products' && !selectedCategory) || selectedCategory === cat 
                            ? "bg-premium-black border-premium-black text-white" 
                            : "bg-white border-neutral-100 text-neutral-500"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </section>
                {/* Add more filter sections here if needed */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
