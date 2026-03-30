'use client';

import Link from 'next/link';
import { Clock, Star, Gift, ArrowRight, Sparkles, ChefHat } from 'lucide-react';

const specialOffers = [
  {
    id: 1,
    title: 'Happy Hour Luxe',
    description: '50% off select appetizers & signature cocktails curated for the evening.',
    validTime: 'Mon - Fri, 3 PM - 6 PM',
    discount: '50% OFF',
    type: 'time-based',
    gradient: 'from-amber-600/40 to-orange-600/20'
  },
  {
    id: 2,
    title: 'Epicurean Night',
    description: 'Four-course degustation for two with sommelier-picked wine pairings.',
    validTime: 'Available Daily',
    discount: '$129.99',
    type: 'package',
    gradient: 'from-pink-600/40 to-rose-600/20'
  },
  {
    id: 3,
    title: 'Imperial Brunch',
    description: 'Unlimited gourmet buffet featuring hand-carved stations & mimosa towers.',
    validTime: 'Sat - Sun, 10 AM - 2 PM',
    discount: '$45 / PAX',
    type: 'weekend',
    gradient: 'from-blue-600/40 to-indigo-600/20'
  },
  {
    id: 4,
    title: 'Legacy Feast',
    description: 'Bespoke family menu for parties of 6 or more. Multi-generational favorites.',
    validTime: 'Available Daily',
    discount: 'FAMILY TIER',
    type: 'family',
    gradient: 'from-emerald-600/40 to-teal-600/20'
  },
  {
    id: 5,
    title: 'Royal Birthday',
    description: 'Complimentary signature dessert & personalized tableside celebration.',
    validTime: 'Valid on Birthdays',
    discount: 'FREE TREAT',
    type: 'birthday',
    gradient: 'from-purple-600/40 to-violet-600/20'
  },
  {
    id: 6,
    title: 'Chef\'s Masterpiece',
    description: 'Nine-course journey showcasing our chef\'s most experimental creations.',
    validTime: 'Thu - Sat, 7 PM',
    discount: '$185 / PAX',
    type: 'premium',
    gradient: 'from-amber-500/60 to-yellow-600/20'
  }
];

export default function SpecialPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 relative overflow-hidden">
      {/* Background Aesthetics */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] pointer-events-none -z-10 animate-float"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/20 mb-6 group">
            <Sparkles size={14} className="text-amber-500 group-hover:rotate-45 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Seasonal Collections</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
            Exclusive <span className="text-gradient">Privileges</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            Curated experiences for the discerning palate. Discover our limited-time culinary programs and private memberships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {specialOffers.map((offer, index) => (
            <div 
              key={offer.id} 
              className="glass-panel group relative overflow-hidden rounded-[40px] border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-4 shadow-2xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header Gradient */}
              <div className={`h-48 relative bg-gradient-to-br ${offer.gradient} p-8 flex flex-col justify-end overflow-hidden`}>
                <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                  {offer.type === 'time-based' && <Clock className="text-white" size={24} />}
                  {offer.type === 'package' && <ChefHat className="text-white" size={24} />}
                  {offer.type === 'weekend' && <Star className="text-white" size={24} />}
                  {offer.type === 'family' && <Gift className="text-white" size={24} />}
                  {offer.type === 'birthday' && <Sparkles className="text-white" size={24} />}
                  {offer.type === 'premium' && <Star className="text-white" size={24} />}
                </div>
                
                <h3 className="text-sm font-black text-white/60 uppercase tracking-[0.3em] mb-2">{offer.validTime}</h3>
                <div className="text-4xl font-black text-white tracking-tight">{offer.discount}</div>
              </div>

              <div className="p-10">
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-amber-500 transition-colors uppercase">{offer.title}</h3>
                <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed h-12 overflow-hidden">
                  {offer.description}
                </p>
                
                <Link
                  href="/menu"
                  className="group w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all duration-300 active:scale-95 shadow-xl"
                >
                  Experience Now
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
              
              {/* Internal Accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors duration-700"></div>
            </div>
          ))}
        </div>

        {/* Philosophy/Terms Section */}
        <div className="mt-32 glass-panel p-16 rounded-[60px] border border-white/5 relative overflow-hidden animate-fade-in-up shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[120px] pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-black text-white mb-8 tracking-tight">Our Privilege <br/> <span className="text-amber-500">Philosophy</span></h2>
              <p className="text-gray-400 text-lg font-light leading-relaxed mb-6">
                We believe that dining is more than just a meal—it is a sacred ritual. Our special offers are designed as invitations to explore the depths of our culinary craft at a privileged access.
              </p>
              <p className="text-sm text-gray-500 font-medium">
                * Membership tiers are re-evaluated annually based on engagement and patronage. Terms of service apply to all promotional cycles.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                'Single-use per reservation cycle',
                'Advanced booking required for Tasting Menus',
                'Happy Hour valid in Blue Lounge only',
                'Birthday verification via verified ID',
                'Gratuity calculated on pre-discount total'
              ].map((term, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] group-hover:scale-150 transition-transform"></div>
                  <p className="text-gray-300 font-semibold tracking-wide text-sm">{term}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
