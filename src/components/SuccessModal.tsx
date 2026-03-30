'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  orderNumber?: string;
  type?: 'order' | 'reservation';
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  orderNumber,
  type = 'order' 
}: SuccessModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 100);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-6 transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      
      <div className={`relative w-full max-w-lg glass-panel overflow-hidden rounded-[40px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-700 transform ${show ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'}`}>
        {/* Animated Success Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/20 to-transparent pointer-events-none" />
        
        <div className="px-10 py-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-glow">
              <CheckCircle size={48} className="text-white animate-bounce-subtle" />
            </div>
          </div>
          
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">{title}</h2>
          <p className="text-gray-400 font-light text-lg mb-8 leading-relaxed">{message}</p>
          
          {orderNumber && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-bold mb-2">Reference Number</p>
              <p className="text-3xl font-black text-amber-500 tracking-wider font-mono">{orderNumber}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <Link 
              href="/"
              onClick={onClose}
              className="group bg-white text-black py-4 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-amber-500 hover:text-white transition-all duration-300 active:scale-95 shadow-xl"
            >
              <Home size={20} />
              Return Home
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
            
            <button 
              onClick={onClose}
              className="group bg-white/5 text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/5 active:scale-95"
            >
              <ShoppingBag size={20} className="text-amber-500" />
              Close & Browse More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
