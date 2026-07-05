'use client';

import { useCart } from '../../contexts/CartContext';
import Link from 'next/link';

export default function DebugPage() {
  const { state, addToCart, getTotalItems, getTotalPrice } = useCart();

  const testItem = {
    id: 'test-1',
    name: 'Test Item',
    price: 10.99,
    category: 'test',
    description: 'This is a test item'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Cart Functionality</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cart State</h2>
        <p><strong>Total Items:</strong> {getTotalItems()}</p>
        <p><strong>Total Price:</strong> ${getTotalPrice().toFixed(2)}</p>
        <p><strong>Table Number:</strong> {state.tableNumber || 'Not set'}</p>
        
        <h3 className="text-lg font-semibold mt-4 mb-2">Cart Items:</h3>
        {state.items.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <ul className="space-y-2">
            {state.items.map((item) => (
              <li key={item.id} className="border p-2 rounded">
                {item.name} - Quantity: {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
        <button
          onClick={() => addToCart(testItem)}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4 hover:bg-blue-700"
        >
          Add Test Item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="space-x-4">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          <Link href="/menu" className="text-blue-600 hover:underline">Menu</Link>
          <Link href="/cart" className="text-blue-600 hover:underline">Cart</Link>
          <Link href="/?table=5" className="text-blue-600 hover:underline">Home with Table 5</Link>
          <Link href="/menu?table=5" className="text-blue-600 hover:underline">Menu with Table 5</Link>
        </div>
      </div>
    </div>
  );
}
