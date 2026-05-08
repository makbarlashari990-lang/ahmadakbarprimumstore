import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Upload, 
  Search, 
  MoreHorizontal, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { collection, query, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../../lib/firebase';
import { cn, formatPrice } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import type { Product, Order } from '../../types';
import { signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setIsVerifying(false);
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsVerifying(false);
      }
    }
    checkAdminStatus();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (authLoading || isVerifying) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-cream">
       <div className="w-16 h-16 organic-gradient rounded-full animate-pulse flex items-center justify-center text-brand-yellow shadow-2xl">L</div>
       <p className="mt-6 text-xs font-black uppercase tracking-[0.5em] text-brand-yellow">Authenticating...</p>
    </div>
  );

  if (!user || !isAdmin) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-brand-brown p-10 text-center">
       <div className="w-24 h-24 bg-brand-yellow rounded-full flex items-center justify-center text-white shadow-2xl mb-10">
          <ShieldCheck className="w-12 h-12" />
       </div>
       <h1 className="text-cream text-4xl font-display font-black uppercase tracking-tighter mb-4">Permission Denied</h1>
       <p className="text-cream/50 max-w-sm mb-12 font-medium">Access to the Lashari Organic Mart admin panel is restricted to verified administrators only.</p>
       <div className="flex gap-4">
          <a href="/" className="daivik-button">Back to Store</a>
          <button onClick={handleLogout} className="bg-white/10 text-cream px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/20 transition-all">Sign Out</button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-brand-brown text-cream hidden lg:flex flex-col rounded-r-[3rem] shadow-2xl shadow-brand-brown/20 border-r border-brand-yellow/10">
        <div className="p-10 pb-16 flex flex-col items-center border-b border-white/5">
           <div className="w-16 h-16 organic-gradient rounded-[1.5rem] flex items-center justify-center text-brand-yellow shadow-2xl mb-6 border-2 border-brand-yellow/20">
              <span className="text-2xl font-black">L</span>
           </div>
           <h2 className="text-xl font-display font-black uppercase tracking-tight">Admin<span className="text-brand-yellow italic font-light lowercase">Panel</span></h2>
           <p className="text-[10px] text-cream/40 uppercase tracking-[0.3em] font-black mt-2">Lashari Organic Mart</p>
        </div>

        <nav className="flex-1 p-8 space-y-3">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Khalis Products', icon: Package },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
            { id: 'customers', label: 'Top Families', icon: Users },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group",
                activeTab === item.id 
                ? "bg-brand-yellow text-white shadow-xl shadow-brand-yellow/20" 
                : "text-cream/40 hover:text-cream hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-4">
                 <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-white" : "text-brand-yellow group-hover:scale-110 transition-transform")} />
                 {item.label}
              </div>
              {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto border-t border-white/5">
           <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 group active:scale-95 transition-all">
              <img src={user.photoURL || ''} alt="Admin" className="w-10 h-10 rounded-xl border-2 border-brand-yellow shadow-lg" />
              <div className="flex-1 overflow-hidden">
                 <p className="text-xs font-black uppercase tracking-tight truncate">{user.displayName}</p>
                 <button onClick={handleLogout} className="text-[10px] text-brand-yellow uppercase tracking-widest font-black flex items-center gap-1 mt-1 hover:underline">
                    <LogOut className="w-3 h-3" /> Sign Out
                 </button>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-14 custom-scrollbar">
         <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-5 h-5 text-brand-yellow" />
                  <span className="text-brand-yellow text-[10px] font-black uppercase tracking-[0.4em]">Live Farm Management</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none text-brand-brown">
                  {activeTab === 'overview' && 'Harvest Stats'}
                  {activeTab === 'products' && 'Farm Products'}
                  {activeTab === 'orders' && 'Recent Orders'}
               </h1>
            </div>
            
            <div className="flex gap-4">
               {activeTab === 'products' && (
                 <button className="bg-brand-yellow text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-brand-yellow/20 flex items-center gap-3 active:scale-95 transition-all">
                    <Plus className="w-5 h-5" /> Add Pure Item
                 </button>
               )}
               {activeTab === 'orders' && (
                 <button className="bg-brand-brown text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
                    Generate Export
                 </button>
               )}
            </div>
         </header>

         <div className="space-y-12">
            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'products' && <ProductsSection />}
            {activeTab === 'orders' && <OrdersSection />}
         </div>
      </main>
    </div>
  );
}

function OverviewSection() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        setRecentOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentOrders();
  }, []);

  return (
    <div className="space-y-12">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Farm Revenue', value: 'PKR 4.8M', trend: '+22%', up: true },
          { label: 'Khalis Orders', value: recentOrders.length.toString(), trend: '+5%', up: true },
          { label: 'New Families', value: '840+', trend: '+12%', up: true },
          { label: 'Stock Health', value: '94%', trend: '-2%', up: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-brand-yellow/5 shadow-2xl shadow-brand-yellow/5 flex flex-col group hover:-translate-y-2 transition-all duration-500">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow mb-6">{stat.label}</span>
            <div className="flex items-end justify-between">
               <span className="text-3xl font-display font-black text-brand-brown">{stat.value}</span>
               <div className={cn("flex items-center gap-1 font-black text-[10px] px-2 py-1 rounded-full", stat.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
               </div>
            </div>
            <div className="h-1 w-full bg-neutral-50 rounded-full mt-6 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '70% '}}
                 className="h-full bg-brand-yellow"
               />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-brand-yellow/5 shadow-2xl shadow-brand-yellow/5 overflow-hidden">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-brand-yellow mb-10 pb-6 border-b border-brand-yellow/5">Recent Harvesters (Orders)</h3>
            <div className="space-y-8">
               {recentOrders.map(order => (
                 <div key={order.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-full bg-brand-brown/5 border border-brand-yellow/10 flex items-center justify-center text-brand-yellow font-black shadow-inner">
                          {order.shippingAddress.fullName.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-black uppercase tracking-tight text-brand-brown group-hover:text-brand-yellow transition-colors">{order.shippingAddress.fullName}</p>
                          <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">{order.shippingAddress.city} • {new Date(order.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-brand-brown">{formatPrice(order.totalAmount)}</p>
                       <span className="text-[9px] font-black uppercase tracking-widest text-brand-yellow">{order.paymentMethod}</span>
                    </div>
                 </div>
               ))}
               {recentOrders.length === 0 && !loading && (
                 <div className="text-center py-20">
                    <ShoppingBag className="w-12 h-12 text-brand-yellow opacity-10 mx-auto mb-6" />
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">No khalis orders yet.</p>
                 </div>
               )}
            </div>
         </div>

         <div className="bg-white rounded-[3rem] p-10 border border-brand-yellow/5 shadow-2xl shadow-brand-yellow/5">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-brand-yellow mb-10 pb-6 border-b border-brand-yellow/5">Popular Stocks</h3>
            <div className="space-y-10">
               {[
                 { name: 'Pure Sidr Honey', val: 88, icon: '🍯' },
                 { name: 'Cow Desi Ghee', val: 76, icon: '🍶' },
                 { name: 'Gilgit Dry Fruits', val: 54, icon: '🥜' },
                 { name: 'Traditional Spices', val: 32, icon: '🌶️' },
               ].map((item, i) => (
                 <div key={i} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-brand-brown">
                       <span className="flex items-center gap-2"> {item.icon} {item.name}</span>
                       <span className="text-brand-yellow">{item.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-50 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: `${item.val}%` }}
                         className="h-full bg-brand-yellow"
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="bg-white rounded-[3rem] border border-brand-yellow/5 shadow-2xl shadow-brand-yellow/5 overflow-hidden">
       <div className="p-10 border-b border-brand-yellow/5 flex flex-col md:row items-center justify-between gap-6 bg-neutral-50/30">
          <div className="relative w-full md:w-96">
             <input 
               type="text" 
               placeholder="Search by farm batch or name..." 
               className="w-full bg-white border border-brand-yellow/10 pl-14 pr-6 py-4 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-yellow shadow-sm"
             />
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-yellow/50" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow">Total Stocks: {products.length} Units</span>
       </div>

       <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.4em] font-black text-brand-yellow border-b border-brand-yellow/5">
                <tr>
                   <th className="px-10 py-6">Product Batch</th>
                   <th className="px-10 py-6">Category</th>
                   <th className="px-10 py-6">Harvest Price</th>
                   <th className="px-10 py-6">Stock Health</th>
                   <th className="px-10 py-6">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-brand-yellow/5">
                {products.length > 0 ? (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-brand-yellow/5 transition-all duration-300">
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-neutral-100 overflow-hidden border border-brand-yellow/10 p-1">
                                <img src={product.images[0]} className="w-full h-full object-cover rounded-xl" />
                             </div>
                             <div>
                                <p className="text-sm font-black uppercase tracking-tight text-brand-brown">{product.name}</p>
                                <p className="text-[9px] text-neutral-300 font-mono italic mt-1 uppercase tracking-widest">BATCH: {product.id.slice(0, 8)}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow bg-brand-yellow/5 px-4 py-2 rounded-xl">{product.category}</span>
                       </td>
                       <td className="px-10 py-8 text-sm font-black text-brand-brown">{formatPrice(product.price)}</td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                             <div className="w-20 h-1.5 bg-neutral-50 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-yellow" style={{ width: `${Math.min(100, product.stock)}%` }} />
                             </div>
                             <span className="text-[10px] font-black text-neutral-400">{product.stock} Units</span>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <button className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300 hover:bg-brand-yellow hover:text-white transition-all shadow-sm">
                             <MoreHorizontal className="w-5 h-5" />
                          </button>
                       </td>
                    </tr>
                  ))
                ) : !loading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                       <div className="w-20 h-20 bg-brand-yellow/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-yellow/20">
                          <Package className="w-10 h-10" />
                       </div>
                       <h4 className="text-lg font-black text-brand-brown uppercase tracking-tighter">No Farm Products Yet</h4>
                       <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] mt-2">Start adding khalis products from your farm harvest.</p>
                    </td>
                  </tr>
                ) : null}
             </tbody>
          </table>
       </div>
    </div>
  );
}

function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-[3rem] border border-brand-yellow/5 shadow-2xl shadow-brand-yellow/5 overflow-hidden">
       <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.4em] font-black text-brand-yellow border-b border-brand-yellow/5">
                <tr>
                   <th className="px-10 py-6">Order ID</th>
                   <th className="px-10 py-6">Khalis Family</th>
                   <th className="px-10 py-6">Harvest Date</th>
                   <th className="px-10 py-6">Value</th>
                   <th className="px-10 py-6">Status</th>
                   <th className="px-10 py-6">Payment</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-brand-yellow/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-yellow/5 transition-all duration-300">
                     <td className="px-10 py-8 font-mono text-[10px] font-black text-neutral-300 uppercase tracking-widest">#{order.id.slice(0, 10)}</td>
                     <td className="px-10 py-8">
                        <div>
                           <p className="text-sm font-black uppercase tracking-tight text-brand-brown">{order.shippingAddress.fullName}</p>
                           <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest mt-1">{order.shippingAddress.city}</p>
                        </div>
                     </td>
                     <td className="px-10 py-8 text-[11px] font-bold text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                     <td className="px-10 py-8 text-sm font-black text-brand-brown">{formatPrice(order.totalAmount)}</td>
                     <td className="px-10 py-8">
                        <span className={cn(
                          "px-4 py-2 text-[9px] uppercase font-black tracking-widest rounded-xl shadow-sm",
                          order.status === 'Pending' && "bg-yellow-50 text-yellow-600",
                          order.status === 'Delivered' && "bg-green-50 text-green-600",
                          order.status === 'Cancelled' && "bg-red-50 text-red-600",
                        )}>
                          {order.status}
                        </span>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                           <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{order.paymentMethod}</span>
                        </div>
                     </td>
                   </tr>
                ))}
                {orders.length === 0 && !loading && (
                   <tr>
                     <td colSpan={6} className="px-10 py-32 text-center text-xs text-neutral-300 font-bold uppercase tracking-widest italic">Wait for first family harvest order.</td>
                   </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
}
