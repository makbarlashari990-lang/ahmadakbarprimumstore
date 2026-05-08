import { motion } from 'framer-motion';
import { CATEGORIES } from '../constants';
import { CategoryCard } from '../components/ui/Cards';
import { Leaf } from 'lucide-react';

export default function Categories() {
  return (
    <div className="pt-40 pb-20 max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center mb-20 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-brand-yellow" />
          <span className="text-brand-yellow text-[10px] font-black uppercase tracking-[0.4em]">Our Departments</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-display font-black text-brand-brown uppercase tracking-tighter">
          Explore Organic <span className="text-brand-yellow italic">Harvests</span>
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto font-medium">
          From traditional desi ghee to pure wild honey, find everything you need for a healthy, organic lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((category, i) => (
          <div key={category.id} className="h-64">
            <CategoryCard category={category} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
