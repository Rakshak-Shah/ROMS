'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShoppingBag, Users, Star, 
  PlusCircle, ClipboardList, CalendarCheck, PackageSearch, 
  ArrowRight, ShieldCheck, Activity, BarChart3, TrendingUp 
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'admin' && user.role !== 'staff'))) {
      showToast('Unauthorized access to command console.', 'error');
      router.push('/login');
      return;
    }

    if (user) {
      loadDashboard();
    }
  }, [user, loading, router]);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to sync with headquarters.');
      showToast('Telemetry sync failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
            <div className="w-16 h-16 border-t-2 border-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 animate-pulse">Initializing HQ Console...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
            <ShieldCheck className="text-red-500" size={32} />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">System Intrusion</h2>
        <p className="text-gray-500 font-light max-w-sm mb-10 leading-relaxed">{error}</p>
        <button 
          onClick={loadDashboard}
          className="px-10 py-4 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl"
        >
          Re-Authenticate System
        </button>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Request Volume', 
      value: dashboardData?.ordersCount || 0, 
      icon: ShoppingBag, 
      color: 'from-amber-600 to-amber-400',
      desc: 'Total active orders in queue'
    },
    { 
      label: 'Verified Patrons', 
      value: dashboardData?.usersCount || 0, 
      icon: Users, 
      color: 'from-emerald-600 to-emerald-400',
      desc: 'Registered executive accounts'
    },
    { 
      label: 'Approval Rating', 
      value: dashboardData?.reviewsCount || 0, 
      icon: Star, 
      color: 'from-indigo-600 to-indigo-400',
      desc: 'Testimonials published'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 relative overflow-hidden">
      {/* Background Intelligence */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 blur-[150px] pointer-events-none -z-10 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none -z-10 animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* HQ Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 animate-fade-in-down">
          <div>
            <div className="flex items-center gap-3 mb-4 text-amber-500">
               <Activity size={18} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Operational Status: Elite</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
               Command <span className="text-gradient">Center</span>
            </h1>
            <p className="text-xl text-gray-500 font-light max-w-xl leading-relaxed">
               Welcome back, <span className="text-white font-bold">{user?.name}</span>. The facility is operating at maximum culinary efficiency.
            </p>
          </div>
          
          <div className="flex gap-3">
             <div className="glass-panel px-6 py-4 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Server Uptime</p>
                    <p className="text-sm font-black text-emerald-500 uppercase">99.98% Active</p>
                </div>
                <div className="w-1.5 h-6 bg-emerald-500/20 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-500 animate-pulse"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up stagger-1">
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel p-10 rounded-[40px] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 transform translate-x-12 -translate-y-12 pointer-events-none group-hover:bg-white/10 transition-colors"></div>
              
              <div className="flex items-center justify-between mb-10 relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                   <stat.icon size={28} />
                </div>
                {i === 0 && <TrendingUp className="text-amber-500" size={20} />}
                {i === 1 && <BarChart3 className="text-emerald-500" size={20} />}
                {i === 2 && <Star className="text-indigo-500 fill-indigo-500" size={20} />}
              </div>
              
              <div className="relative">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                <p className="text-5xl font-black text-white tracking-tighter mb-4">{stat.value}</p>
                <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-[200px]">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Command Control */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in-up stagger-2">
           
           {/* Navigation Deck */}
           <div className="lg:col-span-2 glass-panel p-12 rounded-[50px] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[120px] pointer-events-none"></div>
              
              <h2 className="text-3xl font-black text-white mb-12 tracking-tight flex items-center gap-4 uppercase">
                <ShieldCheck className="text-amber-500" size={24} /> 
                Tactical Modules
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Cuisine Deployment', desc: 'Add new gastronomic items', icon: PlusCircle, href: '/admin/menu', tint: 'bg-blue-500' },
                  { name: 'Request Archive', desc: 'Manage order state & legacy', icon: ClipboardList, href: '/admin/orders', tint: 'bg-orange-500' },
                  { name: 'Reservation Matrix', desc: 'Adjust seating & timeline', icon: CalendarCheck, href: '/admin/reservations', tint: 'bg-purple-500' },
                  { name: 'Vault Inventory', desc: 'Resource tracking & logistics', icon: PackageSearch, href: '/admin/inventory', tint: 'bg-emerald-500' },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(action.href)}
                    className="flex items-center gap-6 p-6 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-amber-500/20 transition-all group text-left relative overflow-hidden"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${action.tint}/10 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                       <action.icon className="text-white opacity-80 group-hover:opacity-100" size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-black tracking-tight text-lg mb-1">{action.name}</h4>
                      <p className="text-gray-500 text-xs font-medium leading-relaxed">{action.desc}</p>
                    </div>
                    <ArrowRight className="absolute right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-amber-500" size={20} />
                  </button>
                ))}
              </div>
           </div>

           {/* Quick Actions Portal */}
           <aside className="space-y-6">
              <div className="glass-panel p-10 rounded-[40px] border border-white/5 bg-gradient-to-br from-amber-500/10 to-transparent shadow-2xl relative group overflow-hidden">
                 <h3 className="text-white font-black uppercase text-xs tracking-widest mb-8 border-l-2 border-amber-500 pl-4">System Update</h3>
                 <p className="text-gray-400 text-sm font-light leading-relaxed mb-10">
                   The latest culinary engine update (v3.4.1) is now active. All order workflows have been optimized for luxury speed.
                 </p>
                 <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-amber-500 hover:text-white transition-all shadow-xl active:scale-95">
                    View Release Notes
                 </button>
              </div>

              <div className="glass-panel p-10 rounded-[40px] border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center group">
                 <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-105 transition-transform duration-500">
                    <ShieldCheck className="text-amber-500" size={32} />
                 </div>
                 <h4 className="text-white font-black text-lg mb-2 tracking-tight">Security Protocol</h4>
                 <p className="text-gray-600 text-xs font-medium leading-relaxed max-w-[180px]">
                    Your session is currently encrypted with 256-bit military grade protection.
                 </p>
              </div>
           </aside>

        </div>
      </div>
    </div>
  );
}
