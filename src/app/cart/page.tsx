'use client';

import { useState, useEffect, Suspense } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useSearchParams } from 'next/navigation';
import { Plus, Minus, Trash2, CreditCard, DollarSign, MapPin, Edit, Truck } from 'lucide-react';
import Link from 'next/link';
import DeliveryAddress from '../../components/deliveryaddress';
import PaymentStatus from './payment-status';

function CartContent() {
  const { 
    state, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getDeliveryFee, 
    getFinalTotal,
    clearCart, 
    setDeliveryAddress 
  } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  // DELIVERY ADDRESS MODAL STATE - Controls when address modal is shown
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  
  // Check if this is a payment status redirect
  if (paymentStatus) {
    return <PaymentStatus />;
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  // DELIVERY ADDRESS HANDLERS - Manage delivery address collection
  const handleAddressConfirm = (address: string) => {
    setDeliveryAddress(address);
    setShowAddressModal(false);
  };

  const handleAddressCancel = () => {
    setShowAddressModal(false);
  };

  // ESEWA PAYMENT HANDLER - Integrates with eSewa payment gateway
  const handleEsewaPayment = async () => {
    const orderTotal = getFinalTotal();
    const orderDetails = {
      amount: orderTotal,
      tax_amount: (getTotalPrice() + getDeliveryFee()) * 0.085,
      total_amount: orderTotal,
      product_code: 'DELICIOUS_RESTAURANT',
      product_service_charge: 0,
      product_delivery_charge: getDeliveryFee(),
      success_url: `${window.location.origin}/cart?payment=success`,
      failure_url: `${window.location.origin}/cart?payment=failed`,
      // Generate unique transaction ID
      transaction_uuid: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      // Create eSewa payment form dynamically
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://uat.esewa.com.np/epay/main'; // Use production URL for live: https://esewa.com.np/epay/main
      
      // Add form fields for eSewa
      const fields = {
        'tAmt': orderDetails.total_amount.toFixed(2),
        'amt': orderDetails.amount.toFixed(2), 
        'txAmt': orderDetails.tax_amount.toFixed(2),
        'psc': orderDetails.product_service_charge,
        'pdc': orderDetails.product_delivery_charge.toFixed(2),
        'scd': orderDetails.product_code,
        'pid': orderDetails.transaction_uuid,
        'su': orderDetails.success_url,
        'fu': orderDetails.failure_url
      };

      Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key as keyof typeof fields].toString();
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
    } catch (error) {
      console.error('eSewa payment error:', error);
      alert('Payment initialization failed. Please try again.');
    }
  };

  const handleCheckout = async () => {
    // Validation
    if (state.items.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }
    
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    // DELIVERY ADDRESS CHECK - Ask for address only at checkout for delivery orders
    if (state.serviceType === 'delivery' && !state.deliveryAddress) {
      setShowAddressModal(true);
      return;
    }

    // ESEWA PAYMENT INTEGRATION - Redirect to eSewa for online payments
    if (paymentMethod === 'online') {
      await handleEsewaPayment();
      return;
    }

    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      // CALCULATE FINAL ORDER TOTALS - Shows complete breakdown
      const subtotal = getTotalPrice();
      const deliveryFee = getDeliveryFee();
      const tax = (subtotal + deliveryFee) * 0.085;
      const orderTotal = getFinalTotal();
      
      let deliveryInfo = '';
      if (state.serviceType === 'delivery') {
        deliveryInfo = `\n\n🚚 Delivery Address:\n${state.deliveryAddress}\n${deliveryFee > 0 ? `Delivery Fee: $${deliveryFee.toFixed(2)}` : 'FREE DELIVERY! 🎉'}`;
      } else if (state.tableNumber) {
        deliveryInfo = `\n\n🍽️ Table ${state.tableNumber}`;
      }
      
      const orderSummary = `Order placed successfully! ✅\n\n📋 Order Summary:\n- Items: ${state.items.length}\n- Subtotal: $${subtotal.toFixed(2)}${deliveryFee > 0 ? `\n- Delivery: $${deliveryFee.toFixed(2)}` : ''}\n- Tax: $${tax.toFixed(2)}\n- Total: $${orderTotal.toFixed(2)}\n\n💳 ${paymentMethod === 'online' ? 'Payment will be processed online.' : 'Please pay at the counter.'}${deliveryInfo}`;
      
      alert(orderSummary);
      clearCart();
      setIsProcessing(false);
    }, 2000);
  };

  if (state.items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/menu"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block"
            >
              Browse Menu
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* DELIVERY ADDRESS SECTION - Shows for delivery orders with address */}
            {state.serviceType === 'delivery' && state.deliveryAddress && (
              <div className="bg-white rounded-lg shadow-sm mb-6 animate-slide-in-left">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
                        <p className="text-sm text-gray-600 mt-1">{state.deliveryAddress}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      <Edit size={16} />
                      <span>Change</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* ORDER ITEMS SECTION */}
            <div className="bg-white rounded-lg shadow-sm animate-slide-in-left">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Order Items</h2>
              </div>
              <div className="p-6 space-y-4">
                {state.items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 hover:scale-102 transition-all duration-300 transform animate-fade-in-up group" 
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{item.description}</p>
                      <p className="text-lg font-bold text-amber-600">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 hover:scale-110 transition-all duration-200 active:scale-95"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold animate-pulse">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 hover:scale-110 transition-all duration-200 active:scale-95"
                      >
                        <Plus size={16} className="hover:animate-wiggle" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <Trash2 size={16} className="hover:animate-wiggle" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* SPACING GAP - Visual separation between cart items and bill */}
            <div className="h-8"></div>
          </div>

          {/* ORDER SUMMARY SECTION - Right side shows bill and payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 animate-slide-in-right">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              {/* BILL BREAKDOWN - Shows all charges including delivery */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                
                {/* DELIVERY FEE DISPLAY - Only shows for delivery orders */}
                {state.serviceType === 'delivery' && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Truck size={14} className="mr-1 text-green-600" />
                      <span>Delivery:</span>
                    </div>
                    <div className="text-right">
                      {getDeliveryFee() > 0 ? (
                        <span>${getDeliveryFee().toFixed(2)}</span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-green-600 font-medium">FREE</span>
                          <span className="text-xs text-gray-500">Orders ${state.freeDeliveryThreshold}+</span>
                        </div>
                      )}
                    </div>
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

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center space-x-2">
                      <CreditCard size={16} />
                      <span>Pay Online</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      value="offline"
                      checked={paymentMethod === 'offline'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'offline')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center space-x-2">
                      <DollarSign size={16} />
                      <span>Pay at Counter</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 hover:scale-105 hover:shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className={isProcessing ? 'loading-dots' : ''}>
                  {isProcessing 
                    ? 'Processing' 
                    : paymentMethod === 'online' 
                      ? `Pay with eSewa - $${getFinalTotal().toFixed(2)}`
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
              
              {/* ESEWA PAYMENT INFO */}
              {paymentMethod === 'online' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💳 eSewa Payment</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• You will be redirected to eSewa for secure payment</p>
                    <p>• Please keep your eSewa credentials ready</p>
                    <p>• Payment amount: NPR {getFinalTotal().toFixed(2)}</p>
                  </div>
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
          </div>
        </div>
        
        {/* DELIVERY ADDRESS MODAL - Appears when user needs to set address */}
        <DeliveryAddress
          isOpen={showAddressModal}
          currentAddress={state.deliveryAddress || ''}
          onConfirm={handleAddressConfirm}
          onCancel={handleAddressCancel}
        />
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading cart...</div>}>
      <CartContent />
    </Suspense>
  );
}
