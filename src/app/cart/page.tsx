'use client';

import { useState, Suspense } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Minus, Trash2, DollarSign, MapPin, Edit, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeliveryAddress from '../../components/deliveryaddress';
import { orderService } from '../../lib/api';

function CartContent() {
  const [error, setError] = useState<string | null>(null);
  
  // Wrap cart hook in try-catch
  let cartState;
  try {
    cartState = useCart();
  } catch (err) {
    console.error('Error accessing cart context:', err);
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Cart Error</h1>
            <p className="text-gray-600 mb-8">There was an error loading your cart. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { 
    state, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getDeliveryFee, 
    getFinalTotal,
    clearCart, 
    setDeliveryAddress 
  } = cartState;
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleAddressConfirm = (address: string) => {
    setDeliveryAddress(address);
    setShowAddressModal(false);
    showToast('Delivery address updated', 'success');
  };

  const handleAddressCancel = () => {
    setShowAddressModal(false);
  };


  const handleCheckout = async () => {
    if (state.items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    // AUTHENTICATION CHECK - Users must be logged in to place orders
    if (!isAuthenticated || !user) {
      const confirmed = confirm('You need to login to place an order. Would you like to login now?');
      if (confirmed) {
        router.push('/login');
      }
      return;
    }

    if (state.serviceType === 'delivery' && !state.deliveryAddress) {
      setShowAddressModal(true);
      return;
    }

    setIsProcessing(true);
    
    try {
      // CALCULATE FINAL ORDER TOTALS
      const subtotal = getTotalPrice();
      const deliveryFee = getDeliveryFee();
      const tax = (subtotal + deliveryFee) * 0.085;
      const orderTotal = getFinalTotal();
      
      // Determine order type based on service type
      let orderType: 'dine-in' | 'delivery' | 'takeout' = 'dine-in';
      if (state.serviceType === 'delivery') {
        orderType = 'delivery';
      } else if (!state.tableNumber) {
        orderType = 'takeout';
      }

      // Prepare order data for API
      const orderData = {
        items: state.items.map(item => ({
          menuItem: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        orderType,
        tableNumber: state.tableNumber ? parseInt(state.tableNumber) : undefined,
        deliveryAddress: state.deliveryAddress ? {
          street: state.deliveryAddress,
          city: 'N/A',
          state: '',
          zipCode: ''
        } : undefined,
        paymentMethod: 'cash' as const,
        specialInstructions: ''
      };

      // Submit order to backend
      const response = await orderService.create(orderData);
      
      if (response) {
        // Build success message
        let deliveryInfo = '';
        if (state.serviceType === 'delivery') {
          deliveryInfo = `\n\n🚚 Delivery Address:\n${state.deliveryAddress}\n${deliveryFee > 0 ? `Delivery Fee: $${deliveryFee.toFixed(2)}` : 'FREE DELIVERY! 🎉'}`;
        } else if (state.tableNumber) {
          deliveryInfo = `\n\n🍽️ Table ${state.tableNumber}`;
        }
        
        const orderSummary = `Order placed successfully! ✅\n\n📋 Order #${response.orderNumber}\n- Items: ${state.items.length}\n- Subtotal: $${subtotal.toFixed(2)}${deliveryFee > 0 ? `\n- Delivery: $${deliveryFee.toFixed(2)}` : ''}\n- Tax: $${tax.toFixed(2)}\n- Total: $${orderTotal.toFixed(2)}\n\n💳 Please pay at the counter.${deliveryInfo}\n\nYour order is now visible to the admin/staff.`;
        
        alert(orderSummary);
        clearCart();
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again or contact staff.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen pt-40 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          <div className="glass-panel p-16 rounded-[60px] border border-white/10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl pointer-events-none"></div>
             <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="text-gray-700" size={40} />
             </div>
             <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Your Cart is Empty</h1>
             <p className="text-gray-500 mb-12 font-light text-lg">
               Indulge your senses. Discover our curated selection of gourmet masterpieces.
             </p>
             <Link
               href="/menu"
               className="group relative inline-flex px-10 py-5 bg-white text-black rounded-3xl font-black text-lg items-center gap-3 hover:bg-amber-500 hover:text-white transition-all duration-500 active:scale-95 shadow-xl"
             >
               Explore Menu
               <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Order</h1>
          
          {/* LOGIN WARNING - Shows if user is not authenticated */}
          {!isAuthenticated && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-blue-800">
                    Please login to place your order
                  </p>
                  <p className="mt-1 text-sm text-blue-700">
                    You need to be logged in to complete checkout.
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/login"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Login Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {state.tableNumber && (
            <div className="mb-4 bg-amber-100 rounded-lg p-3 inline-block animate-pulse">
              <p className="text-amber-800 font-medium">🍽️ Table {state.tableNumber}</p>
            </div>
          )}
          {state.serviceType === 'delivery' && (
            <div className="mb-4 bg-green-100 rounded-lg p-3 inline-block animate-pulse">
              <p className="text-green-800 font-medium">🚚 Delivery Service</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items Area */}
          <div className="lg:col-span-2 space-y-8">
            {state.serviceType === 'delivery' && state.deliveryAddress && (
              <div className="glass-panel p-8 rounded-[40px] border border-white/10 animate-fade-in-up shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl pointer-events-none"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <MapPin className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Delivery Destination</h3>
                      <p className="text-gray-500 text-sm font-light mt-1">{state.deliveryAddress}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-2 text-emerald-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all group"
                  >
                    <Edit size={14} className="group-hover:rotate-12 transition-transform" />
                    Change
                  </button>
                </div>
              </div>
            )}
            
            {/* ORDER ITEMS SECTION */}
            <div className="bg-white rounded-lg shadow-sm animate-slide-in-left text-black">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Order Items</h2>
              </div>
              <div className="divide-y divide-white/5">
                {state.items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="p-8 flex items-center gap-8 hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-amber-500/20 to-transparent flex items-center justify-center border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <ShoppingBag className="text-white/20" size={32} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black text-white tracking-tight group-hover:text-amber-500 transition-colors uppercase">{item.name}</h3>
                        <p className="text-2xl font-black text-white tracking-tighter">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-gray-500 text-sm font-light line-clamp-1 mb-6 leading-relaxed">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-[#0a0a0a] rounded-2xl p-1 border border-white/10">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white active:scale-90"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-black text-white text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-all text-white active:scale-90 shadow-lg"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-400 font-bold text-xs uppercase tracking-widest transition-all"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout/Summary Sidebar */}
          <aside className="animate-fade-in-up stagger-2">
            <div className="glass-panel p-10 rounded-[50px] border border-white/10 sticky top-28 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl pointer-events-none"></div>
               
               <h2 className="text-2xl font-black text-white mb-10 tracking-tight uppercase">Billing Details</h2>
               
               <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Subtotal</span>
                    <span className="text-white font-black text-lg">${getTotalPrice().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Tax (8.5%):</span>
                  <span>${((getTotalPrice() + getDeliveryFee()) * 0.085).toFixed(2)}</span>
                </div>
                
                {/* VISUAL SEPARATOR */}
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-amber-600">${getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Payment Method</h3>
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                  <DollarSign size={20} className="text-amber-600" />
                  <span className="text-gray-700 font-medium">Pay at Counter</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Complete your payment at the counter when you arrive or upon delivery.
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 hover:scale-105 hover:shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className={isProcessing ? 'loading-dots' : ''}>
                  {isProcessing 
                    ? 'Processing Order...' 
                    : `Place Order - $${getFinalTotal().toFixed(2)}`
                  }
                </span>
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/menu"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* DELIVERY ORDER INFO - Shows delivery details and requirements */}
              {state.serviceType === 'delivery' && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🚚 Delivery Order</h4>
                  {state.deliveryAddress ? (
                    <div className="text-sm text-green-700 space-y-1">
                      <p>✅ Delivery address confirmed</p>
                      <p>📍 {state.deliveryAddress}</p>
                      {getDeliveryFee() === 0 && (
                        <p className="font-medium">🎉 Free delivery on this order!</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-green-700">
                      <p>📍 Delivery address will be collected when you place the order</p>
                    </div>
                  )}
                </div>
              )}
              
              {state.tableNumber && !state.serviceType && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">🍽️ Dine-In Order</h4>
                  <p className="text-sm text-amber-700">
                    Your order will be delivered to Table {state.tableNumber}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <DeliveryAddress
        isOpen={showAddressModal}
        currentAddress={state.deliveryAddress || ''}
        onConfirm={handleAddressConfirm}
        onCancel={() => setShowAddressModal(false)}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Order Finalized"
        message="Your gourmet selection is now being prepared by our executive chefs."
        orderNumber={lastOrderNumber}
        type="order"
      />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}
