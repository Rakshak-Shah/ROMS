'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { getTotalItems } = useCart();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Special', href: '/special' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Reviews', href: '/reviews' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 animate-slide-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <h1 className="text-2xl font-bold text-amber-600 group-hover:scale-105 transition-transform duration-300">Delicious</h1>
              <p className="text-xs text-gray-600 group-hover:text-amber-500 transition-colors duration-300">Restaurant</p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-600 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/cart"
              className="text-gray-700 hover:text-amber-600 p-2 transition-all duration-300 relative hover:scale-110 group"
            >
              <ShoppingCart size={20} className="group-hover:animate-wiggle" />
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {getTotalItems()}
              </span>
            </Link>
            <Link
              href="/login"
              className="bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-700 hover:scale-105 hover:shadow-lg transition-all duration-300 transform active:scale-95 flex items-center space-x-2"
            >
              <User size={16} />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/cart"
              className="text-gray-700 hover:text-amber-600 p-2 transition-colors relative"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-amber-600 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in-down">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-amber-600 block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/login"
                className="bg-amber-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-700 transition-colors mt-4"
                onClick={() => setIsOpen(false)}
              >
                Login / Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
