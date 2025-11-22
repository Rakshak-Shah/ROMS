'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Minus, ShoppingCart, Info, Filter, ArrowRight } from 'lucide-react';
import { useCart, MenuItem } from '../../contexts/CartContext';
import FoodImage from '../../components/FoodImage';
import { menuService, ApiMenuItem } from '../../lib/api';

// Fallback sample menu data
const fallbackMenuData: MenuItem[] = [
  // Appetizers
  {
    id: '1',
    name: 'Daal Bhaat',
    price: 12.99,
    category: 'appetizers',
    description: 'Toasted bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil',
    image: '/placeholder-food.jpg'
  },
  {
    id: '2',
    name: 'Calamari Fritti',
    price: 15.99,
    category: 'appetizers',
    description: 'Crispy fried squid rings served with marinara sauce and lemon',
    image: '/placeholder-food.jpg'
  },
  {
    id: '3',
    name: 'Antipasto Platter',
    price: 18.99,
    category: 'appetizers',
    description: 'Selection of cured meats, cheeses, olives, and marinated vegetables',
    image: '/placeholder-food.jpg'
  },

  // Main Courses
  {
    id: '4',
    name: 'Grilled Salmon',
    price: 28.99,
    category: 'mains',
    description: 'Fresh Atlantic salmon grilled to perfection with lemon herb butter',
    image: '/placeholder-food.jpg'
  },
  {
    id: '5',
    name: 'Ribeye Steak',
    price: 35.99,
    category: 'mains',
    description: '12oz prime ribeye steak grilled to your liking with garlic mashed potatoes',
    image: '/placeholder-food.jpg'
  },
  {
    id: '6',
    name: 'Lobster Thermidor',
    price: 42.99,
    category: 'mains',
    description: 'Fresh lobster in a rich, creamy sauce with cheese and herbs',
    image: '/placeholder-food.jpg'
  },
  {
    id: '7',
    name: 'Chicken Parmesan',
    price: 24.99,
    category: 'mains',
    description: 'Breaded chicken breast topped with marinara sauce and mozzarella',
    image: '/placeholder-food.jpg'
  },

  // Pasta
  {
    id: '8',
    name: 'Spaghetti Carbonara',
    price: 19.99,
    category: 'pasta',
    description: 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper',
    image: '/placeholder-food.jpg'
  },
  {
    id: '9',
    name: 'Fettuccine Alfredo',
    price: 17.99,
    category: 'pasta',
    description: 'Fresh fettuccine pasta in a rich, creamy parmesan sauce',
    image: '/placeholder-food.jpg'
  },
  {
    id: '10',
    name: 'Penne Arrabbiata',
    price: 16.99,
    category: 'pasta',
    description: 'Penne pasta in a spicy tomato sauce with garlic and chili',
    image: '/placeholder-food.jpg'
  },

  // Desserts
  {
    id: '11',
    name: 'Tiramisu',
    price: 9.99,
    category: 'desserts',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
    image: '/placeholder-food.jpg'
  },
  {
    id: '12',
    name: 'Chocolate Lava Cake',
    price: 8.99,
    category: 'desserts',
    description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream',
    image: '/placeholder-food.jpg'
  },
  {
    id: '13',
    name: 'Panna Cotta',
    price: 7.99,
    category: 'desserts',
    description: 'Silky smooth vanilla custard topped with berry compote',
    image: '/placeholder-food.jpg'
  },

  // Beverages
  {
    id: '14',
    name: 'House Wine (Glass)',
    price: 8.99,
    category: 'beverages',
    description: 'Red or white wine from our carefully selected house collection',
    image: '/placeholder-food.jpg'
  },
  {
    id: '15',
    name: 'Craft Beer',
    price: 6.99,
    category: 'beverages',
    description: 'Selection of local craft beers on tap',
    image: '/placeholder-food.jpg'
  },
  {
    id: '16',
    name: 'Fresh Juice',
    price: 4.99,
    category: 'beverages',
    description: 'Freshly squeezed orange, apple, or grapefruit juice',
    image: '/placeholder-food.jpg'
  }
];

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
        
        // Fetch menu items from backend API
        const items = await menuService.getAll();
        console.log('Fetched menu items from API:', items.length, 'items');
        
        // Transform API items to match MenuItem interface
        const transformedItems: MenuItem[] = items.map((item: ApiMenuItem) => ({
          id: item._id,
          name: item.name,
          price: item.isSpecial && item.specialPrice ? item.specialPrice : item.price,
          category: item.category,
          description: item.description || '',
          image: item.image || '/placeholder-food.jpg'
        }));
        
        if (transformedItems.length > 0) {
          console.log('Successfully loaded', transformedItems.length, 'menu items from database');
          setMenuData(transformedItems);
          setError(null);
        } else {
          // Use fallback data if API returns empty
          console.warn('No menu items found in database, using fallback data');
          setMenuData(fallbackMenuData);
          setError('Using sample menu data - backend database is empty. Run "npm run seed" in backend folder.');
        }
      } catch (err) {
        console.error('Error fetching menu from backend:', err);
        setError('Failed to connect to backend API. Using sample data. Make sure backend is running.');
        setMenuData(fallbackMenuData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Set table and service type from URL params (avoid infinite loops)
  useEffect(() => {
    // Only update if different from current state
    if (tableNumber !== null && tableNumber !== undefined && state.tableNumber !== tableNumber) {
      setTable(tableNumber);
    }
    if (serviceType !== null && serviceType !== undefined && state.serviceType !== serviceType) {
      setServiceType(serviceType);
    }
    // Do NOT include setTable/setServiceType in deps to avoid identity changes triggering loops
  }, [tableNumber, serviceType, state.tableNumber, state.serviceType]);

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
                  {state.serviceType === 'delivery' && (
                    <div className="text-xs text-green-600 mb-2">
                      🚚 Delivery Order
                    </div>
                  )}
                  <Link
                    href="/cart"
                    onClick={(e) => {
                      console.log('View Cart clicked');
                      console.log('Cart items:', state.items.length);
                      console.log('Service type:', state.serviceType);
                    }}
                    className="mt-3 w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>View Shopping Cart</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                  {/* Debug link - remove in production */}
                  {process.env.NODE_ENV === 'development' && (
                    <Link
                      href="/debug/cart"
                      className="mt-2 w-full bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs text-center block hover:bg-gray-300 transition-colors"
                    >
                      Debug Cart Issues
                    </Link>
                  )}
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
                            <span className="font-semibold text-lg animate-pulse text-black">{quantity}</span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="w-8 h-8 rounded-full bg-amber-600  flex items-center justify-center hover:bg-amber-700 hover:scale-110 transition-all duration-200 active:scale-95"
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
