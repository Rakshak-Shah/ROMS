'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function CartDebugPage() {
  const router = useRouter();
  
  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart_state');
      alert('Cart localStorage cleared! Refresh the page.');
    }
  };

  const viewLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('cart_state');
      console.log('Cart localStorage:', data);
      alert('Check browser console for cart data');
    }
  };

  const testCartContext = () => {
    try {
      const cart = useCart();
      console.log('Cart context loaded successfully:', cart.state);
      alert('Cart context is working! Check console.');
    } catch (error) {
      console.error('Cart context error:', error);
      alert('Cart context error! Check console.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Cart Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <button
            onClick={clearLocalStorage}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700"
          >
            Clear Cart localStorage
          </button>
          
          <button
            onClick={viewLocalStorage}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
          >
            View Cart localStorage (Console)
          </button>
          
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700"
          >
            Go to Cart Page
          </button>
          
          <button
            onClick={() => router.push('/menu?service=delivery')}
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700"
          >
            Go to Menu (Delivery)
          </button>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
            <li>If cart page isn't loading, click "Clear Cart localStorage"</li>
            <li>Then go to Menu and add items again</li>
            <li>Try navigating to cart page</li>
            <li>Check browser console for any errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

