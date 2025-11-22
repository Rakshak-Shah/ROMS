'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, UtensilsCrossed, ShoppingBag, Calendar, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Menu', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Reservations', href: '/admin/reservations', icon: Calendar },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-2' : 'py-5'}`}>
      <div className={`max-w-7xl mx-auto px-6 transition-all duration-500 ${scrolled ? 'glass-panel rounded-full mx-6 max-w-[calc(100%-3rem)]' : ''}`}>
        <div className="flex justify-between h-16 items-center">
          
          {/* Admin Identity */}
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:rotate-12 transition-all">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black text-white tracking-tight leading-none group-hover:text-amber-500 transition-colors uppercase">HQ Panel</h1>
                <p className="text-[10px] text-amber-500/70 font-bold uppercase tracking-[0.2em]">Management Suite</p>
              </div>
            </Link>
          </div>

          {/* Core Command Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-glow'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'animate-pulse' : ''} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Command Right */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-gray-500 hover:text-amber-500 transition-colors relative">
               <Bell size={18} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl transition-all border border-white/5 group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
                  <User size={16} className="text-amber-500" />
                </div>
                <span className="text-sm font-bold text-gray-200 group-hover:text-white">{user?.name?.split(' ')[0]}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 glass-panel rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] py-4 z-[110] border border-white/10 animate-fade-in-down origin-top-right">
                  <div className="px-6 py-4 border-b border-white/5 mb-2">
                    <p className="font-black text-white text-base tracking-tight">{user?.name}</p>
                    <p className="text-xs text-gray-500 font-medium mb-1">{user?.email}</p>
                    <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{user?.role} Access</span>
                  </div>
                  
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="flex items-center w-full px-6 py-3 text-sm text-red-400 font-bold hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} className="mr-3" />
                    Secure Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Controller */}
          <div className="lg:hidden flex items-center gap-4">
             <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-amber-500 text-white' : 'glass-panel text-white'}`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Command Center */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full mt-4 animate-fade-in-down">
            <div className="mx-4 glass-panel rounded-[32px] border border-white/10 p-4 shadow-2xl overflow-hidden">
               <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex flex-col items-center gap-2 p-6 rounded-2xl transition-all ${
                          isActive ? 'bg-amber-500 text-white shadow-glow' : 'hover:bg-white/5 text-gray-500'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                      </Link>
                    );
                  })}
               </div>
               
               <div className="h-px bg-white/5 my-4 mx-4"></div>
               
               <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full py-4 text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500/10 rounded-2xl transition-all"
               >
                 Secure Account Logout
               </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
