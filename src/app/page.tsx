'use client';

import Link from 'next/link';
import { ChefHat, ShoppingCart, Calendar, QrCode, Star, Users } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function HomeContent() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-96 h-96 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -left-8 w-64 h-64 bg-white/3 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {tableNumber && (
              <div className="mb-6 bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block animate-fade-in-down">
                <p className="text-lg font-medium">Welcome to Table {tableNumber}</p>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Welcome to <span className="text-amber-200 animate-pulse">Delicious</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              Experience culinary excellence with our carefully crafted dishes using the finest ingredients
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <Link
                href="/menu"
                className="bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-300 transform inline-flex items-center justify-center"
              >
                View Our Menu
              </Link>
              <Link
                href="/reservations"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-amber-600 hover:scale-105 hover:shadow-lg transition-all duration-300 transform inline-flex items-center justify-center"
              >
                Reserve Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Would You Like to Dine?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dine In */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transform animate-fade-in-up group">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-amber-200 transition-all duration-300">
                <ChefHat className="w-8 h-8 text-amber-600 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Dine In</h3>
              <p className="text-gray-600 mb-6">
                Scan the QR code at your table to browse our menu and place orders directly to your table.
              </p>
              <div className="space-y-3">
                <Link
                  href={`/menu${tableNumber ? `?table=${tableNumber}` : ''}`}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block w-full"
                >
                  Browse Menu
                </Link>
                <Link
                  href="/admin/qr-generator"
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors inline-block w-full text-sm"
                >
                  Generate QR Codes
                </Link>
              </div>
            </div>

            {/* Order Now - Delivery Service */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transform animate-fade-in-up group" style={{animationDelay: '0.2s'}}>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-green-200 transition-all duration-300">
                <ShoppingCart className="w-8 h-8 text-green-600 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Delivery Service</h3>
              <p className="text-gray-600 mb-6">
                Order online and get delicious food delivered straight to your door. Fast, convenient, and fresh.
              </p>
              <Link
                href="/menu?service=delivery"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors inline-block"
              >
                Order for Delivery
              </Link>
            </div>

            {/* Reserve Table */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transform animate-fade-in-up group" style={{animationDelay: '0.4s'}}>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
                <Calendar className="w-8 h-8 text-blue-600 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Reserve Table</h3>
              <p className="text-gray-600 mb-6">
                Book your table in advance to guarantee your spot for a memorable dining experience.
              </p>
              <Link
                href="/reservations"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Delicious?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up group">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-amber-200 transition-all duration-300">
                <QrCode className="w-8 h-8 text-amber-600 group-hover:animate-wiggle" />
              </div>
              <h3 className="text-lg font-semibold mb-2">QR Code Ordering</h3>
              <p className="text-gray-600">
                Scan the QR code at your table to instantly access our menu and place orders.
              </p>
            </div>
            <div className="text-center animate-fade-in-up group" style={{animationDelay: '0.2s'}}>
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-amber-200 transition-all duration-300">
                <Star className="w-8 h-8 text-amber-600 group-hover:animate-wiggle" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                We use only the finest ingredients sourced from local farms and trusted suppliers.
              </p>
            </div>
            <div className="text-center animate-fade-in-up group" style={{animationDelay: '0.4s'}}>
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-amber-200 transition-all duration-300">
                <Users className="w-8 h-8 text-amber-600 group-hover:animate-wiggle" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Exceptional Service</h3>
              <p className="text-gray-600">
                Our dedicated staff ensures every guest has an unforgettable dining experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-amber-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Delicious?</h2>
          <p className="text-xl mb-8">
            Join us for an unforgettable culinary journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <Link
              href="/menu"
              className="bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-300 transform"
            >
              Browse Menu
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-amber-600 hover:scale-105 hover:shadow-lg transition-all duration-300 transform"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
