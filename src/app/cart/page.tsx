'use client';

import { useState, Suspense } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useSearchParams } from 'next/navigation';
import { Plus, Minus, Trash2, CreditCard, DollarSign, MapPin, Edit, Truck, ShoppingBag, ArrowRight, Wallet } from 'lucide-react';
import Link from 'next/link';
import DeliveryAddress from '../../components/deliveryaddress';
import PaymentStatus from './payment-status';
import { orderService, CreateOrderData } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/components/Toast';
import SuccessModal from '@/components/SuccessModal';

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
  const { showToast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<string>('');
  const { user } = useAuth();
  
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  
  if (paymentStatus) {
    return <PaymentStatus />;
  }

  const handleAddressConfirm = (address: string) => {
    setDeliveryAddress(address);
    setShowAddressModal(false);
    showToast('Delivery address updated', 'success');
  };

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
      transaction_uuid: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://uat.esewa.com.np/epay/main';
      
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
      showToast('Payment initialization failed. Please try again.', 'error');
    }
  };

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    
    if (!user) {
      showToast('Please sign in to complete your order', 'info');
      return;
    }

    if (state.serviceType === 'delivery' && !state.deliveryAddress) {
      setShowAddressModal(true);
      return;
    }

    if (paymentMethod === 'online') {
      await handleEsewaPayment();
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderData: CreateOrderData = {
        items: state.items.map(item => ({
          menuItem: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        orderType: state.serviceType === 'delivery' ? 'delivery' : (state.tableNumber ? 'dine-in' : 'takeout'),
        tableNumber: state.tableNumber ? parseInt(state.tableNumber) : undefined,
        deliveryAddress: state.serviceType === 'delivery' && state.deliveryAddress ? { street: state.deliveryAddress } : undefined,
        paymentMethod: 'cash',
      };

      const response = await orderService.create(orderData);
      setLastOrderNumber(response?.orderNumber || 'ORD-PENDING');
      setIsSuccessModalOpen(true);
      clearCart();
    } catch (error) {
      showToast('Failed to place order. Please try again.', 'error');
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
    <div className="bg-[#0a0a0a] min-h-screen pt-28 pb-20 relative">
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-amber-500/5 blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">Your <span className="text-gradient">Selection</span></h1>
          <div className="flex flex-wrap gap-4">
             {state.tableNumber && (
               <div className="glass-panel px-4 py-2 rounded-full border border-amber-500/20 text-amber-500 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                 <span className="text-xs font-black uppercase tracking-widest leading-none">Table {state.tableNumber}</span>
               </div>
             )}
             {state.serviceType === 'delivery' && (
               <div className="glass-panel px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-500 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-xs font-black uppercase tracking-widest leading-none">In-Transit Gourmet</span>
               </div>
             )}
          </div>
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
            
            <div className="glass-panel rounded-[40px] border border-white/5 shadow-2xl overflow-hidden animate-fade-in-up stagger-1">
              <div className="p-10 border-b border-white/5 bg-white/5">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                  <ShoppingBag className="text-amber-500" size={24} /> Items in Cart
                </h2>
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
                  
                  {state.serviceType === 'delivery' && (
                    <div className="flex justify-between items-center group">
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-emerald-500" />
                        <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Service Fee</span>
                      </div>
                      <span className={getDeliveryFee() === 0 ? 'text-emerald-500 font-black' : 'text-white font-black'}>
                        {getDeliveryFee() > 0 ? `$${getDeliveryFee().toFixed(2)}` : 'GRATIS'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Luxury Tax (8.5%)</span>
                    <span className="text-white font-black text-lg">${((getTotalPrice() + getDeliveryFee()) * 0.085).toFixed(2)}</span>
                  </div>
                  
                  <div className="h-px bg-white/5 my-6"></div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-5xl font-black text-white tracking-tighter">${getFinalTotal().toFixed(2)}</p>
                    </div>
                    <div className="bg-amber-500/20 px-3 py-1 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-tighter">Verified</div>
                  </div>
               </div>

               {/* Payment Strategy Selection */}
               <div className="mb-12">
                  <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-6 border-l-2 border-amber-500 pl-4">Payment Strategy</p>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={`flex items-center justify-between p-5 rounded-3xl transition-all border ${
                        paymentMethod === 'online' 
                          ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-amber-500/40 text-white' 
                          : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Wallet size={20} className={paymentMethod === 'online' ? 'text-amber-500' : ''} />
                        <span className="font-black text-xs uppercase tracking-widest">eSewa Digital</span>
                      </div>
                      {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-glow"></div>}
                    </button>

                    <button
                      onClick={() => setPaymentMethod('offline')}
                      className={`flex items-center justify-between p-5 rounded-3xl transition-all border ${
                        paymentMethod === 'offline' 
                          ? 'bg-gradient-to-r from-emerald-500/20 to-transparent border-emerald-500/40 text-white' 
                          : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <DollarSign size={20} className={paymentMethod === 'offline' ? 'text-emerald-500' : ''} />
                        <span className="font-black text-xs uppercase tracking-widest">At Counter</span>
                      </div>
                      {paymentMethod === 'offline' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow"></div>}
                    </button>
                  </div>
               </div>

               <button
                 onClick={handleCheckout}
                 disabled={isProcessing}
                 className="group w-full bg-white text-black py-6 rounded-[32px] font-black text-xl hover:bg-amber-500 hover:text-white transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 {isProcessing ? 'AUTHENTICATING...' : (paymentMethod === 'online' ? 'PAY SECURELY' : 'PLACE ORDER')}
                 <ArrowRight size={22} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
               </button>

               <div className="mt-10 text-center">
                  <Link href="/menu" className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 hover:text-amber-500 transition-colors">
                    ← Back to selection
                  </Link>
               </div>
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
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-600 uppercase tracking-widest font-black text-xs animate-pulse">Synchronizing Cart...</div>}>
      <CartContent />
    </Suspense>
  );
}
