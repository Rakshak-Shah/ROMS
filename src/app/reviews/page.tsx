'use client';

import { useState } from 'react';
import { Star, MessageSquare, User, Quote, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '@/components/Toast';

const testimonials = [
  {
    id: 1,
    name: 'Eleanor Vautier',
    date: 'March 24, 2024',
    rating: 5,
    comment: 'The tasting menu was a journey of flavors I haven\'t experienced elsewhere. Truly Michelin-level service and molecular gastronomy at its peak.',
    role: 'Epicurean Critic',
    avatar: 'EV'
  },
  {
    id: 2,
    name: 'Julian Sterling',
    date: 'March 18, 2024',
    rating: 5,
    comment: 'Exceptional atmosphere. The glassmorphic design of the restaurant itself is mirrored in the impeccable presentation of the Octopus Carpaccio.',
    role: 'Interior Designer',
    avatar: 'JS'
  },
  {
    id: 3,
    name: 'Marcus Chen',
    date: 'March 12, 2024',
    rating: 4,
    comment: 'A masterclass in modern dining. Every detail, from the ambient lighting to the custom-made ceramics, speaks of profound luxury.',
    role: 'Gastronomy Enthusiast',
    avatar: 'MC'
  },
  {
    id: 4,
    name: 'Sophia Rossi',
    date: 'March 5, 2024',
    rating: 5,
    comment: 'I celebrated my anniversary here and was treated like royalty. The Chef\'s personalized touch on our dessert was unforgettable.',
    role: 'Lifestyle Blogger',
    avatar: 'SR'
  }
];

export default function ReviewsPage() {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please share your experience', 'error');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      showToast('Your perspective has been recorded. Review pending curation.', 'success');
      setComment('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] pointer-events-none -z-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/20 mb-6">
            <ShieldCheck size={14} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Verified Testimonials</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
            Guest <span className="text-gradient">Perspectives</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            The honest reflections of our global patrons. Discover why Delicious is consistently ranked as a premier gastronomic destination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Testimonials List */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up stagger-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t, index) => (
                <div 
                  key={t.id} 
                  className="glass-card p-10 rounded-[40px] border border-white/5 hover:border-amber-500/20 transition-all duration-500 relative group overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Quote className="absolute -top-4 -right-4 w-24 h-24 text-white/5 group-hover:text-amber-500/10 transition-colors" />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                      {t.avatar}
                    </div>
                    <div>
                      <h3 className="text-white font-black tracking-tight">{t.name}</h3>
                      <p className="text-xs text-amber-500/80 font-bold uppercase tracking-widest leading-none">{t.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < t.rating ? 'fill-amber-500 text-amber-500' : 'text-white/10'} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed font-light italic">
                    &quot;{t.comment}&quot;
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
                    {t.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leave a Review Form */}
          <aside className="animate-fade-in-up stagger-2">
            <div className="glass-panel p-10 rounded-[50px] border border-white/10 sticky top-28 shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none"></div>
               
               <div className="flex items-center gap-3 mb-10">
                <MessageSquare className="text-amber-500" size={24} />
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Your Verdict</h2>
               </div>
               
               <form onSubmit={handleSubmit} className="space-y-10">
                 <div className="space-y-4 text-center">
                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest pl-1">Rating</p>
                    <div className="flex justify-center gap-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            rating >= s ? 'bg-amber-500 text-white shadow-glow' : 'bg-white/5 text-gray-600 hover:text-gray-400'
                          }`}
                        >
                          <Star size={20} className={rating >= s ? 'fill-white' : ''} />
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                   <label className="text-xs text-gray-500 font-black uppercase tracking-widest pl-1">Experience Description</label>
                   <textarea
                    rows={6}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your gastronomic journey..."
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[24px] text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-medium placeholder:text-gray-700 resize-none"
                   />
                 </div>

                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="group w-full bg-white text-black py-5 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber-500 hover:text-white transition-all duration-500 shadow-xl active:scale-95"
                 >
                   {isSubmitting ? 'Recording...' : 'Publish Review'}
                   <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                 </button>
               </form>
            </div>

            <div className="mt-8 glass-panel p-8 rounded-[32px] border border-white/5 text-center group">
              <Sparkles className="text-amber-500 mx-auto mb-4 group-hover:animate-spin transition-all" size={24} />
              <h4 className="text-white font-bold mb-2">Member Rewards</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Elite members earn <span className="text-amber-500 font-black">Luxury Points</span> for every verified review published.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
