'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Settings, LogOut, Shield, CreditCard, ChevronRight, Camera } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] -z-10 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Overlay */}
          <aside className="lg:w-1/3 animate-fade-in-right">
            <div className="glass-panel p-8 rounded-[40px] border border-white/10 sticky top-28 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>
              
              <div className="relative text-center">
                <div className="relative inline-block mb-6 group">
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[32px] flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-500">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white text-black p-3 rounded-2xl shadow-xl hover:bg-amber-500 hover:text-white transition-all">
                    <Camera size={18} />
                  </button>
                </div>
                
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{user.name}</h1>
                <p className="text-amber-500/80 text-sm font-bold uppercase tracking-widest mb-6">{user.role}</p>
                
                <div className="flex justify-center gap-3 mb-8">
                  <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border border-white/5">
                    <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      {user.isActive ? 'Active Member' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'personal', name: 'Personal Details', icon: User },
                    { id: 'security', name: 'Security & login', icon: Shield },
                    { id: 'payment', name: 'Payment Methods', icon: CreditCard },
                    { id: 'settings', name: 'Preferences', icon: Settings },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                        activeTab === tab.id 
                          ? 'bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/20 text-white' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon size={18} className={activeTab === tab.id ? 'text-amber-500' : ''} />
                        <span className="font-semibold text-sm">{tab.name}</span>
                      </div>
                      <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
                    </button>
                  ))}
                  
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
                    >
                      <LogOut size={18} />
                      <span className="text-sm">Sign Out Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:w-2/3 animate-fade-in-up">
            <div className="glass-panel p-10 rounded-[40px] border border-white/10 min-h-[600px] shadow-2xl">
              {activeTab === 'personal' && (
                <div className="animate-fade-in-up">
                  <h2 className="text-3xl font-extrabold text-white mb-10 tracking-tight">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div className="group">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-3">Electronic Mail</p>
                        <div className="flex items-center gap-4 text-white">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Mail className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{user.email}</p>
                            <p className="text-xs text-green-500 font-bold uppercase">Verified Primary</p>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-3">Direct Contact</p>
                        <div className="flex items-center gap-4 text-white">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Phone className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{user.phone || 'Not provided'}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase">Mobile Number</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="group">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-3">Membership status</p>
                        <div className="flex items-center gap-4 text-white">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <Shield className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="font-bold text-lg capitalize">{user.role} tier</p>
                            <p className="text-xs text-gray-500 font-bold uppercase">Access Level</p>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-3">Verification</p>
                        <div className="flex items-center gap-4 text-white">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Shield className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{user.isVerified ? 'Fully Verified' : 'Standard'}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase">KYC Check</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 pt-10 border-t border-white/5">
                    <h3 className="text-xl font-bold text-white mb-6">Saved Addresses</h3>
                    {user.addresses && user.addresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.addresses.map((address) => (
                          <div key={address.id} className="glass-card p-5 border border-white/5 hover:border-amber-500/20 transition-all">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full font-black uppercase tracking-widest">{address.type}</span>
                              {address.isDefault && <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-full font-bold">DEFAULT</span>}
                            </div>
                            <p className="text-sm text-gray-300 font-medium mb-1">{address.address}</p>
                            <p className="text-xs text-gray-500">{address.city}, {address.state} {address.zipCode}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="glass-card p-10 flex flex-col items-center justify-center border-dashed border-white/10">
                        <MapPin className="text-gray-700 mb-4" size={40} />
                        <p className="text-gray-500 font-medium">No saved addresses found</p>
                        <button className="text-amber-500 text-sm font-bold mt-2 hover:underline">Add Your First Address</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab !== 'personal' && (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-fade-in-up">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Settings className="text-gray-700" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Module Under Enhancement</h2>
                  <p className="text-gray-500 max-w-sm">We are currently refining the {activeTab} experiences to match our premium standards.</p>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}

