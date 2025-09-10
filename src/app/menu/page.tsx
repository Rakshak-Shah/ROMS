'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart, MenuItem } from '../../contexts/CartContext';
import FoodImage from '../../components/FoodImage';

// Sample menu data - in a real app, this would come from an API
const menuData: MenuItem[] = [
  // Appetizers
  {
    id: '1',
    name: 'Bruschetta al Pomodoro',
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
  
  const { addToCart, updateQuantity, state, setTable, setServiceType } = useCart();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');
  const serviceType = searchParams.get('service');

  useEffect(() => {
  if (tableNumber !== undefined && tableNumber !== null) {
    setTable(tableNumber);
  }
  if (serviceType !== undefined && serviceType !== null) {
    setServiceType(serviceType);
  }
}, [tableNumber, serviceType]);

const filteredItems = menuData.filter(item => item.category === selectedCategory);


// CART HANDLER - Direct add to cart (address will be asked at checkout)
const handleAddToCart = (item: MenuItem) => {
  addToCart(item);
};

const getItemQuantity = (itemId: string) => {
  const cartItem = state.items.find(item => item.id === itemId);
  return cartItem?.quantity || 0;
};


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {tableNumber && (
              <div className="mb-4 bg-amber-100 rounded-lg p-3 inline-block">
                <p className="text-amber-800 font-medium">🍽️ Ordering for Table {tableNumber}</p>
              </div>
            )}
            {serviceType === 'delivery' && (
              <div className="mb-4 bg-green-100 rounded-lg p-3 inline-block">
                <p className="text-green-800 font-medium">🚚 Delivery Service - Address will be collected at checkout</p>
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {serviceType === 'delivery' 
                ? 'Choose from our delicious selection - delivered fresh to your door!' 
                : 'Discover our carefully crafted dishes made with the finest ingredients'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 animate-slide-in-left">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category.id
                        ? 'bg-amber-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>

              {/* Cart Summary */}
              {state.items.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2">Cart Summary</h4>
                  <div className="text-sm text-gray-600 mb-2">
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </div>
                  <div className="text-lg font-semibold text-amber-600">
                    ${state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </div>
                  <Link
                    href="/cart"
                    className="mt-3 w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={16} />
                    <span>View Cart</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item, index) => {
                const quantity = getItemQuantity(item.id);
                return (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform animate-fade-in-up group" 
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="overflow-hidden">
                      <FoodImage 
                        foodName={item.name}
                        category={item.category}
                        className="h-48 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">{item.name}</h3>
                        <span className="text-xl font-bold text-amber-600 group-hover:scale-110 transition-transform duration-300 inline-block">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        {quantity > 0 ? (
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 hover:scale-110 transition-all duration-200 active:scale-95"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-semibold text-lg animate-pulse">{quantity}</span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 hover:scale-110 transition-all duration-200 active:scale-95"
                            >
                              <Plus size={16} className="hover:animate-wiggle" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 hover:scale-105 hover:shadow-lg transition-all duration-300 transform active:scale-95 group-hover:shadow-xl"
                          >
                            Add to Cart
                          </button>
                        )}
                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-600">Total: ${(item.price * Math.max(1, quantity)).toFixed(2)}</p>
                          {quantity > 0 && (
                            <p className="text-sm text-gray-600">{quantity} × ${item.price.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
