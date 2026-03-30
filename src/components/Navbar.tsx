'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, User, ShoppingCart, LogOut, Settings, Utensils } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Menu', href: '/menu' },
    { name: 'Special', href: '/special' },
    { name: 'Contact', href: '/contact' },
    { name: 'Reviews', href: '/reviews' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'glass-card' : ''}`}>
        <div className="flex justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-all border border-amber-500/20">
                <Utensils className="w-6 h-6 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight">Delicious</h1>
                <p className="text-[10px] text-amber-500/70 uppercase tracking-widest font-semibold">Restaurant</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white hover:text-glow px-3 py-2 text-sm font-medium transition-all duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/cart"
              className="text-gray-300 hover:text-amber-400 p-2 transition-all duration-300 relative hover:scale-110 group bg-white/5 rounded-full hover:bg-white/10"
            >
              <ShoppingCart size={20} className="group-hover:animate-wiggle" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center border border-black animate-scale-in">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-300 border border-white/5"
                >
                  <User size={16} className="text-amber-400" />
                  <span className="text-sm font-medium text-gray-200">{user?.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 glass-panel rounded-xl shadow-2xl py-2 z-50 animate-fade-in-down origin-top-right">
                    <div className="px-4 py-3 text-sm text-gray-300 border-b border-white/10 mb-2">
                      <p className="font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} className="mr-3 text-amber-500" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-amber-500 text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-amber-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 transform active:scale-95 flex items-center space-x-2"
              >
                <User size={16} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              href="/cart"
              className="text-gray-300 p-2 relative"
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 p-2 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in-down absolute w-full left-0 top-full mt-2 glass-panel rounded-2xl mx-4 max-w-[calc(100%-2rem)]">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="h-px bg-white/10 my-4" />
              
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 mb-2">
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 text-center bg-amber-500 text-black rounded-xl text-base font-bold hover:bg-amber-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
