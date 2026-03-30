'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Minus, ShoppingCart, Info, Filter, ArrowRight } from 'lucide-react';
import { useCart, MenuItem } from '../../contexts/CartContext';
import FoodImage from '../../components/FoodImage';
import { menuService, ApiMenuItem } from '../../lib/api';

const categories = [
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'mains', name: 'Main Courses' },
  { id: 'pasta', name: 'Pasta' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' }
];

function MenuContent() {
  const [selectedCategory, setSelectedCategory] = useState('appetizers');
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart, updateQuantity, state, setTable, setServiceType } = useCart();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');
  const serviceType = searchParams.get('service');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const items = await menuService.getAll();
        
        if (Array.isArray(items)) {
          const transformedItems: MenuItem[] = items.map((item: ApiMenuItem) => ({
            id: item._id,
            name: item.name,
            price: item.isSpecial && item.specialPrice ? item.specialPrice : item.price,
            category: item.category,
            description: item.description || '',
            image: item.image || '/placeholder-food.jpg'
          }));
          setMenuData(transformedItems);
        } else {
          console.error('Menu data is not an array:', items);
          setError('Invalid menu data format received.');
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Failed to connect to backend. Please ensure the server is running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (tableNumber) setTable(tableNumber);
    if (serviceType) setServiceType(serviceType);
  }, [tableNumber, serviceType, setTable, setServiceType]);

  const filteredItems = menuData.filter(item => item.category === selectedCategory);
  const getItemQuantity = (itemId: string) => state.items.find(item => item.id === itemId)?.quantity || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-20 w-1/3 bg-white/5 rounded-3xl mb-16 animate-pulse"></div>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/4 h-[400px] bg-white/5 rounded-[40px] animate-pulse"></div>
            <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[450px] bg-white/5 rounded-[40px] border border-white/5 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pt-24 pb-12">
      <div className="absolute top-0 right-0 w-full h-[30vh] bg-amber-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-left animate-fade-in-down">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">Our <span className="text-gradient">Culinary</span> Selection</h1>
            <p className="text-gray-400 text-lg max-w-xl font-light">
              Discover dishes crafted with passion and precision by our expert chefs.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center animate-fade-in-up">
            {tableNumber && (
              <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-amber-400 border border-amber-500/20">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-sm font-semibold uppercase tracking-wider">Table {tableNumber}</span>
              </div>
            )}
            {serviceType === 'delivery' && (
              <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 text-green-400 border border-green-500/20">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-semibold uppercase tracking-wider">Express Delivery</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="glass-panel p-4 mb-8 border border-red-500/30 flex items-center gap-3 text-red-400 animate-shake">
            <Info className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-1/4 space-y-6">
            <div className="glass-panel p-8 rounded-3xl sticky top-28 border border-white/5 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Filter className="w-5 h-5 text-amber-500" /> Categories
              </h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`group w-full text-left px-5 py-3 rounded-2xl font-medium transition-all duration-500 ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.03]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white hover:pl-7'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {state.items.length > 0 && (
                <div className="mt-10 pt-8 border-t border-white/10">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Your Cart</p>
                      <p className="text-2xl font-bold text-white">${state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</p>
                    </div>
                    <div className="bg-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-sm font-bold">
                      {state.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </div>
                  </div>
                  <Link
                    href="/cart"
                    className="group w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all duration-300 active:scale-95 shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>View Shopping Cart</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              )}
            </div>
          </aside>

          <main className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
              {filteredItems.map((item, index) => {
                const quantity = getItemQuantity(item.id);
                return (
                  <div 
                    key={item.id} 
                    className="glass-card group relative overflow-hidden rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-56 relative overflow-hidden">
                      <FoodImage 
                        foodName={item.name}
                        category={item.category}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 group-hover:bg-amber-500 transition-colors duration-300">
                        <span className="text-white font-bold text-lg">${item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">{item.name}</h3>
                      <p className="text-gray-400 text-sm font-light mb-8 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {quantity > 0 ? (
                          <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10">
                            <button
                              onClick={() => updateQuantity(item.id, quantity - 1)}
                              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="w-10 text-center font-bold text-white text-lg">{quantity}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-all text-white shadow-lg"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-white text-black px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-lg active:scale-95"
                          >
                            <Plus size={20} /> Add to Cart
                          </button>
                        )}
                        
                        {quantity > 0 && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-0.5">Subtotal</p>
                            <p className="text-lg font-bold text-amber-500">${(item.price * quantity).toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-500 uppercase tracking-widest font-light">Loading...</div>}>
      <MenuContent />
    </Suspense>
  );
}
