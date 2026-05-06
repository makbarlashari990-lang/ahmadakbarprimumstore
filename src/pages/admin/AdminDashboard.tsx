import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Upload, 
  Search, 
  MoreHorizontal, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  XCircle 
} from 'lucide-react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { cn, formatPrice } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import type { Product, Order } from '../../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // In a real app, we would check if user.uid exists in the 'admins' collection
    if (user) {
      setIsAdmin(true);
    }
  }, [user]);

  if (authLoading) return <div className="pt-40 text-center">Loading...</div>;
  if (!user) return <div className="pt-40 text-center uppercase tracking-widest text-xs font-bold">Please login to access admin panel</div>;

  return (
    <div className="pt-24 min-h-screen bg-[#F8F9FA] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-neutral-100 italic font-display font-bold text-lg tracking-tight">
          Akbar Admin <span className="text-[10px] text-gold uppercase not-italic tracking-widest ml-2">v0.1</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'customers', label: 'Customers', icon: Users },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg",
                activeTab === item.id ? "bg-premium-black text-white shadow-md" : "text-neutral-500 hover:bg-neutral-50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold uppercase tracking-tight">
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'products' && 'Product Management'}
              {activeTab === 'orders' && 'Order Management'}
            </h1>
            <p className="text-sm text-neutral-400 font-medium">Welcome back, {user.displayName}. Here's what's happening today.</p>
          </div>
          
          <div className="flex gap-3">
            {activeTab === 'products' && (
              <>
                <button className="bg-white border border-neutral-200 px-6 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 transition-colors">
                  <Upload className="w-4 h-4" /> Bulk Upload
                </button>
                <button className="bg-gold text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-premium-black transition-colors">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </>
            )}
            {activeTab === 'orders' && (
              <button className="bg-white border border-neutral-200 px-6 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 transition-colors">
                <Upload className="w-4 h-4" /> Export CSV
              </button>
            )}
          </div>
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <OrdersTab />}
      </main>
    </div>
  );
}

function OverviewTab() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentOrders() {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
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
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: 'PKR 1.2M', trend: '+12%', color: 'text-green-600' },
          { label: 'Total Orders', value: recentOrders.length.toString(), trend: '+8%', color: 'text-green-600' },
          { label: 'Active Users', value: '2.4K', trend: '+15%', color: 'text-green-600' },
          { label: 'Conversion Rate', value: '3.4%', trend: '-2%', color: 'text-red-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-display font-bold">{stat.value}</span>
              <span className={cn("text-xs font-bold", stat.color)}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Recent Sales</h3>
          <div className="space-y-6">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-400">
                    {order.shippingAddress.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{order.shippingAddress.fullName}</p>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">+{formatPrice(order.totalAmount)}</span>
              </div>
            ))}
            {recentOrders.length === 0 && !loading && (
               <p className="text-xs text-neutral-400 italic">No orders yet.</p>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Top Categories</h3>
          <div className="space-y-6">
             {[
               { name: 'Kitchen Essentials', value: 85 },
               { name: 'Home Decor', value: 65 },
               { name: 'Gadgets', value: 45 },
               { name: 'Organizers', value: 35 },
             ].map((cat, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between text-xs font-bold uppercase">
                   <span>{cat.name}</span>
                   <span>{cat.value}%</span>
                 </div>
                 <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                   <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${cat.value}%` }} />
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
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
    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex flex-col md:row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search products by name, SKU..." 
            className="w-full bg-neutral-50 border border-neutral-200 pl-10 pr-4 py-2.5 text-xs focus:ring-1 focus:ring-gold outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">
           <span>Total: {products.length} Items</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-neutral-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-100 rounded overflow-hidden">
                      <img src={product.images[0]} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight">{product.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono italic">ID: {product.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] uppercase font-bold text-neutral-500">{product.category}</td>
                <td className="px-6 py-4 text-xs font-bold">{formatPrice(product.price)}</td>
                <td className="px-6 py-4 text-xs">
                   <div className="flex items-center gap-2">
                     <div className="w-16 h-1 bg-neutral-100 rounded-full overflow-hidden">
                       <div className="h-full bg-gold" style={{ width: `${Math.min(100, product.stock)}%` }} />
                     </div>
                     <span className="text-[10px] font-bold">{product.stock}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 text-[9px] uppercase font-bold tracking-widest rounded-full",
                    product.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  )}>
                    {product.stock > 0 ? 'Active' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-neutral-200 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-xs text-neutral-400 italic">No products found. Add some to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab() {
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
    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-mono text-[10px] font-bold text-neutral-400">{order.id.slice(0, 10).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold uppercase">{order.shippingAddress.fullName}</p>
                </td>
                <td className="px-6 py-4 text-xs text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-xs font-bold tracking-tight">{formatPrice(order.totalAmount)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 text-[9px] uppercase font-bold tracking-widest rounded-full",
                    order.status === 'Pending' && "bg-yellow-50 text-yellow-600",
                    order.status === 'Processing' && "bg-blue-50 text-blue-600",
                    order.status === 'Shipped' && "bg-purple-50 text-purple-600",
                    order.status === 'Delivered' && "bg-green-50 text-green-600",
                    order.status === 'Cancelled' && "bg-red-50 text-red-600",
                  )}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] font-bold uppercase text-neutral-400">{order.paymentMethod}</span>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-xs text-neutral-400 italic">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
