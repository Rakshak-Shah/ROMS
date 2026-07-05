'use client';

import Link from 'next/link';
import { ChefHat, ShoppingCart, Calendar, QrCode, Star, Users, ArrowRight } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const tableNumber = searchParams.get('table');

  useEffect(() => {
    if (!loading && user && (user.role === 'admin' || user.role === 'staff')) {
      router.push('/admin/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen pt-20">
      {/* Premium Hero Section */}
      <section className="relative px-6 lg:px-12 py-32 flex flex-col items-center justify-center min-h-[85vh] overflow-hidden">
        {/* Abstract Blur Backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-[150px] mix-blend-screen opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-10">
          {tableNumber && (
            <div className="inline-flex glass-panel px-6 py-2 rounded-full items-center animate-fade-in-down mb-6 border border-amber-500/30">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <p className="text-sm font-semibold tracking-wider uppercase text-amber-200">Table {tableNumber} Connected</p>
            </div>
          )}
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight animate-fade-in-up stagger-1 leading-tight text-white drop-shadow-2xl">
            Savor the <br className="hidden md:block"/> 
            <span className="text-gradient animate-glow inline-block">Extraordinary</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-300 font-light max-w-3xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
            Elevating dining into art. Experience culinary masterpieces crafted with passion and zero compromise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up stagger-3 pt-8">
            <Link
              href={`/menu${tableNumber ? `?table=${tableNumber}` : ''}`}
              className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center justify-center gap-3">
                Explore Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/reservations"
              className="group px-10 py-5 glass-panel text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-amber-500/50"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 text-gradient-secondary">How We Serve You</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dine In */}
            <div className="glass-card p-10 flex flex-col items-center text-center animate-fade-in-up stagger-1 group relative overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-8 group-hover:bg-amber-500/20 transition-all backdrop-blur-md border border-amber-500/20 group-hover:scale-110 duration-500">
                  <ChefHat className="w-10 h-10 text-amber-400 group-hover:-rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Dine In</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Immerse yourself in our elegant ambiance. Scan your table\'s QR code for seamless service.
                </p>
                <div className="space-y-4 w-full">
                  <Link href={`/menu${tableNumber ? `?table=${tableNumber}` : ''}`} className="block w-full py-4 rounded-xl bg-amber-500/10 text-amber-300 font-semibold hover:bg-amber-500/20 transition-colors border border-amber-500/20">
                    Browse Menu
                  </Link>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="glass-card p-10 flex flex-col items-center text-center animate-fade-in-up stagger-2 group relative overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-8 group-hover:bg-blue-500/20 transition-all backdrop-blur-md border border-blue-500/20 group-hover:scale-110 duration-500">
                  <ShoppingCart className="w-10 h-10 text-blue-400 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Delivery</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Gourmet delicacies delivered swiftly to your doorstep. Fresh, hot, and impeccable.
                </p>
                <Link href="/menu?service=delivery" className="block w-full py-4 rounded-xl bg-blue-500/10 text-blue-300 font-semibold hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                  Order Delivery
                </Link>
              </div>
            </div>

            {/* Reserve */}
            <div className="glass-card p-10 flex flex-col items-center text-center animate-fade-in-up stagger-3 group relative overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-b from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:bg-emerald-500/20 transition-all backdrop-blur-md border border-emerald-500/20 group-hover:scale-110 duration-500">
                  <Calendar className="w-10 h-10 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Reserve</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Secure your perfect evening. Priority seating for celebrations and romantic dinners.
                </p>
                <Link href="/reservations" className="block w-full py-4 rounded-xl bg-emerald-500/10 text-emerald-300 font-semibold hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                  Book Table
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="border-t border-b border-white/5 bg-black/40 py-16 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center gap-4 animate-fade-in-up stagger-1">
              <QrCode className="w-8 h-8 text-amber-500" />
              <h4 className="text-xl font-bold text-white">Smart Dining</h4>
              <p className="text-gray-400 text-sm">Instant ordering and secure payments via table QR codes.</p>
            </div>
            <div className="flex flex-col items-center gap-4 animate-fade-in-up stagger-2">
              <Star className="w-8 h-8 text-amber-500" />
              <h4 className="text-xl font-bold text-white">Michelin Quality</h4>
              <p className="text-gray-400 text-sm">Award-winning chefs preparing exquisite international cuisines.</p>
            </div>
            <div className="flex flex-col items-center gap-4 animate-fade-in-up stagger-3">
              <Users className="w-8 h-8 text-amber-500" />
              <h4 className="text-xl font-bold text-white">Bespoke Service</h4>
              <p className="text-gray-400 text-sm">A highly trained staff anticipating your every need.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <HomeContent />
    </Suspense>
  );
}
