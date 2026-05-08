import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Grid3X3, Grid2X2, X, Leaf } from 'lucide-react';
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (fetchedProducts.length === 0) {
          setProducts(MOCK_PRODUCTS);
        } else {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
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
        const matchesCategory = !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();
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
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8 overflow-x-hidden">
      {/* Page Header */}
      <div className="bg-cream rounded-3xl p-10 md:p-16 mb-20 relative overflow-hidden border border-brand-yellow/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-5 h-5 text-brand-yellow" />
              <span className="text-brand-yellow text-[10px] font-black uppercase tracking-[0.4em]">100% Khalis Collection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-none text-brand-brown">
              Treasures of the <br /><span className="text-brand-yellow italic">Soil</span>
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <input 
                type="text" 
                placeholder="Find organic goodness..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-brand-yellow/10 pl-12 pr-6 py-4 rounded-full text-sm focus:ring-2 focus:ring-brand-yellow outline-none transition-all shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-brand-yellow" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Desktop Filter Sidebar */}
        <aside className="w-full md:w-72 space-y-12 h-fit md:sticky md:top-32">
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-brown mb-8 flex items-center justify-between border-b border-brand-yellow/20 pb-2">
              Categories
            </h3>
            <div className="flex flex-wrap md:flex-col gap-2">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all text-left",
                  !selectedCategory ? "bg-brand-yellow text-white shadow-lg" : "bg-neutral-50 text-neutral-400 hover:text-brand-yellow"
                )}
              >
                All Harvests
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all text-left",
                    selectedCategory === cat.name ? "bg-brand-yellow text-white shadow-lg" : "bg-neutral-50 text-neutral-400 hover:text-brand-yellow"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-brown mb-8 flex items-center justify-between border-b border-brand-yellow/20 pb-2">
              Price Filter
            </h3>
            <div className="space-y-6">
              <input 
                type="range" 
                min="0" 
                max="20000" 
                step="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-brand-yellow"
              />
              <div className="flex items-center justify-between text-[10px] font-black text-brand-brown uppercase tracking-widest">
                <span>0</span>
                <span className="text-brand-yellow">PKR {priceRange[1]}</span>
              </div>
            </div>
          </section>

          <section>
             <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-brown mb-8 border-b border-brand-yellow/20 pb-2">Sort By</h3>
             <select 
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as any)}
               className="w-full bg-neutral-50 border border-brand-yellow/10 rounded-xl p-4 text-[10px] font-black uppercase tracking-widest text-brand-brown outline-none cursor-pointer"
             >
               <option value="newest">Fresh Arrivals</option>
               <option value="popular">Most Popular</option>
               <option value="price-low">Price: Low to High</option>
               <option value="price-high">Price: High to Low</option>
             </select>
          </section>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-brand-yellow/10">
             <span className="text-[10px] uppercase font-black text-brand-brown tracking-[0.3em]">
                {filteredProducts.length} <span className="text-neutral-300">items</span> found
             </span>
             <div className="flex items-center gap-3 text-neutral-200">
               <button className="p-2 hover:text-brand-yellow transition-colors"><Grid3X3 className="w-5 h-5" /></button>
               <button className="p-2 hover:text-brand-yellow transition-colors"><Grid2X2 className="w-5 h-5" /></button>
             </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-32 text-center bg-cream rounded-[3rem] border border-brand-yellow/10">
              <div className="w-20 h-20 organic-gradient rounded-full flex items-center justify-center mx-auto mb-8 text-brand-yellow shadow-xl">
                 <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-black text-brand-brown mb-4">No results found</h3>
              <p className="text-neutral-500 font-medium mb-10 max-w-sm mx-auto">Try clearing your filters or searching for something else like "Ghee".</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); setPriceRange([0, 20000]); }}
                className="daivik-button"
              >
                Reset All Filters
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
              className="fixed inset-0 bg-brand-brown/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-cream z-[101] p-10 overflow-y-auto rounded-l-[3rem] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="font-display font-black text-3xl uppercase text-brand-brown tracking-tighter">Harvest Filters</h2>
                <button 
                  onClick={() => setIsFilterSidebarOpen(false)}
                  className="p-3 bg-white/50 rounded-full text-brand-brown"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-16">
                <section>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-yellow mb-8 underline decoration-brand-yellow/20 underline-offset-8">Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {['All Harvests', ...CATEGORIES.map(c => c.name)].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => { setSelectedCategory(cat === 'All Harvests' ? null : cat); setIsFilterSidebarOpen(false); }}
                        className={cn(
                          "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          (cat === 'All Harvests' && !selectedCategory) || selectedCategory === cat 
                            ? "bg-brand-yellow text-white shadow-lg" 
                            : "bg-white border border-brand-yellow/10 text-neutral-400"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </section>
                
                <section>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-yellow mb-8 underline decoration-brand-yellow/20 underline-offset-8">Sort Options</h3>
                  <div className="flex flex-col gap-3">
                    {['newest', 'popular', 'price-low', 'price-high'].map(option => (
                      <button 
                        key={option}
                        onClick={() => { setSortBy(option as any); setIsFilterSidebarOpen(false); }}
                        className={cn(
                          "w-full px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-all",
                          sortBy === option ? "bg-brand-brown text-brand-yellow" : "bg-white border border-brand-yellow/10 text-neutral-400"
                        )}
                      >
                        {option.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </section>

                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory(null); setPriceRange([0, 20000]); setIsFilterSidebarOpen(false); }}
                  className="w-full py-5 bg-brand-yellow/10 text-brand-yellow rounded-2xl font-black uppercase text-xs tracking-widest border border-brand-yellow/20"
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
