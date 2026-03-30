'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, MapPin, CheckCircle, ArrowRight, ShieldCheck, Sparkles, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { reservationService } from '@/lib/api';
import { useToast } from '@/components/Toast';
import SuccessModal from '@/components/SuccessModal';

export default function ReservationsPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [resData, setResData] = useState<{ confirmationCode?: string } | null>(null);

  useEffect(() => {
    if (formData.date && formData.guests) {
      fetchAvailableSlots();
    }
  }, [formData.date, formData.guests]);

  const fetchAvailableSlots = async () => {
    try {
      const slots = await reservationService.getAvailableSlots(formData.date, formData.guests);
      setAvailableSlots(slots);
    } catch (err) {
      showToast('Failed to fetch available time slots.', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time) {
      showToast('Please select a preferred dining time.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await reservationService.create(formData);
      setResData(response.data?.reservation);
      setIsSuccessModalOpen(true);
      setFormData({
        date: '',
        time: '',
        guests: 2,
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to secure reservation. Please try another slot.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none -z-10 animate-float"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Reservation Header */}
          <div className="animate-fade-in-down">
            <div className="inline-flex items-center gap-3 mb-8 text-amber-500">
              <div className="h-px w-12 bg-amber-500"></div>
              <span className="text-xs font-black uppercase tracking-[0.4em]">In-House Dining</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
               Secure <span className="text-gradient">Your Table</span>
            </h1>
            <p className="text-xl text-gray-400 font-light max-w-xl leading-relaxed mb-12">
               Experience the art of fine dining. Priority seating for celebrations, intimate dinners, and corporate gatherings.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Priority Access', desc: 'Secure the most coveted tables in the Blue Lounge.', icon: Sparkles },
                { title: 'Verified Security', desc: 'Encrypted confirmation via secure digital keys.', icon: ShieldCheck },
                { title: 'Elite Perks', desc: 'Special arrangements for birthday and anniversary events.', icon: CheckCircle },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-amber-500/10 transition-all flex-shrink-0">
                    <item.icon className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm font-light max-w-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-20 p-8 glass-panel border border-white/5 rounded-[40px] relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex items-center gap-4 text-gray-500 mb-2">
                  <MapPin size={16} className="text-amber-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-sm">Location Policy</span>
               </div>
               <p className="text-sm text-gray-400 font-light italic leading-relaxed">
                 * Tables are held for a maximum of 15 minutes past reservation time. Late arrival may result in waitlisting.
               </p>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="animate-fade-in-up">
            <form onSubmit={handleSubmit} className="glass-panel p-12 rounded-[50px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[80px] pointer-events-none"></div>
               
               <h2 className="text-3xl font-black text-white mb-10 tracking-tight flex items-center gap-3">
                 <Calendar className="text-amber-500" size={24} />
                 The Concierge Desk
               </h2>
               
               <div className="space-y-10">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Dining Date</label>
                       <div className="relative group">
                         <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
                         <input
                          type="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium appearance-none h-14"
                         />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Number of Guests</label>
                       <div className="relative group">
                         <Users className="absolute left-4 top-4 h-5 w-5 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
                         <select
                          name="guests"
                          required
                          value={formData.guests}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium appearance-none h-14"
                         >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <option key={n} value={n} className="bg-[#0a0a0a]">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                         </select>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Preferred Time Slots</label>
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, time: s }))}
                            className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                              formData.time === s 
                                ? 'bg-amber-500 text-white border-amber-400 shadow-glow' 
                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {s}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-3 py-6 glass-card border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600">
                          <Clock size={20} className="mb-2" />
                          <p className="text-xs font-black uppercase tracking-tight">{formData.date ? 'Reviewing Availability...' : 'Select Date Above'}</p>
                        </div>
                      )}
                    </div>
                 </div>

                 <div className="h-px bg-white/5 w-full"></div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Personal Identifier</label>
                       <div className="relative group">
                         <User className="absolute left-4 top-4 h-5 w-5 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
                         <input
                          type="text"
                          name="name"
                          required
                          placeholder="Your official name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium placeholder:text-gray-700 h-14"
                         />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Electronic Mail</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
                            <input
                              type="email"
                              name="email"
                              required
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium placeholder:text-gray-700 h-14"
                            />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Tele-Contact</label>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-4 h-5 w-5 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
                            <input
                              type="tel"
                              name="phone"
                              required
                              placeholder="+1 (555) 000-0000"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium placeholder:text-gray-700 h-14"
                            />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Special Requirements</label>
                       <div className="relative group">
                         <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
                         <textarea
                          name="specialRequests"
                          placeholder="Allergies, seating preference, or celebration notes..."
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium placeholder:text-gray-700 h-32 resize-none"
                         />
                       </div>
                    </div>
                 </div>

                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="group w-full bg-white text-black py-6 rounded-[24px] font-black text-xl hover:bg-amber-500 hover:text-white transition-all duration-500 shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isSubmitting ? 'SECURING...' : 'CONFIRM RESERVATION'}
                   <ArrowRight size={22} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                 </button>
               </div>
            </form>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Reservation Confirmed"
        message="Your elite reservation has been successfully secured. A confirmation digital key has been sent to your email."
        orderNumber={resData?.confirmationCode}
        type="reservation"
      />
    </div>
  );
}
