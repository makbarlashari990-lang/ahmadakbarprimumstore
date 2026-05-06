import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, ShoppingCart, RefreshCw } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { cn } from '../lib/utils';

const CUSTOMIZABLE_PRODUCTS = [
  { id: 'custom-mug', name: 'Premium Ceramic Mug', price: 1200, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?q=80&w=500', overlayBox: 'top-[30%] left-[25%] w-[40%] h-[40%]' },
  { id: 'custom-tshirt', name: 'Premium Cotton T-Shirt', price: 2500, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500', overlayBox: 'top-[25%] left-[30%] w-[40%] h-[40%]' },
  { id: 'custom-pillow', name: 'Luxury Decor Pillow', price: 1800, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=500', overlayBox: 'top-[25%] left-[25%] w-[50%] h-[50%]' },
];

export default function CustomDesign() {
  const [selectedProduct, setSelectedProduct] = useState(CUSTOMIZABLE_PRODUCTS[0]);
  const [design, setDesign] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setDesign(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleAddToCart = () => {
    if (!design) return;
    setIsAdding(true);
    addItem({
      ...selectedProduct,
      description: 'Custom designed product',
      category: 'Decor',
      images: [selectedProduct.image],
      rating: 5,
      reviewsCount: 0,
      stock: 999,
      createdAt: Date.now(),
    }, 1, design);
    
    setTimeout(() => {
      setIsAdding(false);
      setDesign(null);
      alert('Custom design added to cart!');
    }, 1000);
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center mb-16">
        <span className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-2 block">Personalization Studio</span>
        <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-4">Design Your Own</h1>
        <p className="text-neutral-500 max-w-md mx-auto">Upload your designs or photos and see them live on our premium products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Preview Container */}
        <div className="bg-white p-8 luxury-card sticky top-32">
          <div className="relative aspect-square bg-neutral-50 overflow-hidden mb-8 group">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name} 
              className="w-full h-full object-cover"
            />
            
            {/* Live Preview Overlay */}
            <AnimatePresence>
              {design && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={cn("absolute z-10 pointer-events-none flex items-center justify-center", selectedProduct.overlayBox)}
                >
                  <img src={design} alt="Preview" className="max-w-full max-h-full object-contain shadow-sm opacity-80 mix-blend-multiply" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {!design && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400">Design Area</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">{selectedProduct.name}</h2>
              <span className="text-gold font-bold">PKR {selectedProduct.price}</span>
            </div>
            {design && (
              <button 
                onClick={() => setDesign(null)}
                className="text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs uppercase font-bold"
              >
                <RefreshCw className="w-3 h-3" /> Reset Design
              </button>
            )}
          </div>
        </div>

        {/* Controls Container */}
        <div className="space-y-12">
          {/* Step 1: Select Product */}
          <section>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400 mb-6">Step 1: Choose Product</h3>
            <div className="grid grid-cols-3 gap-4">
              {CUSTOMIZABLE_PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={cn(
                    "p-4 border transition-all text-left group",
                    selectedProduct.id === p.id ? "bg-premium-black border-premium-black text-white" : "bg-white border-neutral-100 hover:border-gold/50"
                  )}
                >
                  <div className="aspect-square mb-3 overflow-hidden bg-neutral-50">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] uppercase font-bold block leading-tight">{p.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Upload Design */}
          <section>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400 mb-6">Step 2: Upload Your Design</h3>
            <div 
              {...getRootProps()} 
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
                isDragActive ? "border-gold bg-gold/5" : "border-neutral-200 hover:border-gold/50 bg-neutral-50"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 mx-auto mb-4 text-neutral-300" />
              <p className="text-sm text-neutral-500 mb-2 font-medium">
                {isDragActive ? 'Drop your design here' : 'Drag & drop your design here, or click to select'}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400">PNG or JPG recommended (Max 5MB)</p>
            </div>
          </section>

          {/* Step 3: Confirmation */}
          <button
            disabled={!design || isAdding}
            onClick={handleAddToCart}
            className={cn(
              "w-full py-6 uppercase text-sm font-bold tracking-[0.3em] flex items-center justify-center gap-3 transition-all",
              design ? "bg-gold text-white hover:bg-premium-black" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            )}
          >
            {isAdding ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add Custom Item to Cart
              </>
            )}
          </button>

          <div className="bg-gold/5 border border-gold/10 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-gold text-white p-2 rounded-full">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">Quality Guaranteed</h4>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Every custom product is carefully reviewed by our production team to ensure your design looks perfect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
