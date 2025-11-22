'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Globe, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    if (!formData.email.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }
    if (!formData.subject) {
      showToast('Please select a subject', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      showToast('Message sent! We\'ll get back to you within 24 hours.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] pointer-events-none -z-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none -z-10 animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Luxury Header */}
        <div className="text-left mb-20 animate-fade-in-down">
          <div className="flex items-center gap-3 mb-6 text-amber-500">
            <div className="h-px w-12 bg-amber-500"></div>
            <span className="text-xs font-black uppercase tracking-[0.4em]">Get in Touch</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl leading-relaxed">
            Whether it&apos;s a reservation inquiry or a private event, our concierge team is standing by to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information Cards */}
          <div className="space-y-6 animate-fade-in-up stagger-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 group hover:-translate-y-2 border border-white/5 shadow-2xl transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
                  <MapPin className="text-amber-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Presence</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  123 Luxury Food Street<br />
                  Culinary Center, NY 10001
                </p>
              </div>

              <div className="glass-card p-8 group hover:-translate-y-2 border border-white/5 shadow-2xl transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                  <Phone className="text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Inquiries</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Direct: +1 (555) 123-4567<br />
                  Concierge: Ext. 504
                </p>
              </div>

              <div className="glass-card p-8 group hover:-translate-y-2 border border-white/5 shadow-2xl transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                  <Mail className="text-emerald-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Electronic</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  info@delicious.com<br />
                  reservations@delicious.com
                </p>
              </div>

              <div className="glass-card p-8 group hover:-translate-y-2 border border-white/5 shadow-2xl transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
                  <Clock className="text-purple-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Schedule</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Daily: 11 AM - 11 PM<br />
                  Weekends: Until Midnight
                </p>
              </div>
            </div>

            <div className="glass-panel p-10 rounded-[40px] border border-white/5 shadow-2xl mt-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none"></div>
               <div className="flex items-center gap-4 mb-6">
                <Globe className="text-amber-500" size={20} />
                <h4 className="text-lg font-bold text-white uppercase tracking-widest text-sm">Online Reservation</h4>
               </div>
               <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Prefer to book instantly? Use our secure reservation portal for immediate confirmation.
               </p>
               <button className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase tracking-widest hover:text-white transition-colors group">
                 Open Portal <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </div>

          {/* Contact Form Overlay */}
          <div className="animate-fade-in-up stagger-2">
            <div className="glass-panel p-12 rounded-[50px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 blur-[100px] pointer-events-none -z-10"></div>
              
              <div className="flex items-center gap-3 mb-10">
                <MessageSquare className="text-amber-500" size={24} />
                <h2 className="text-3xl font-black text-white tracking-tight">Express Messenger</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-medium placeholder:text-gray-700"
                      placeholder="E.g. Jonathan Ive"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Electronic Mail</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-medium placeholder:text-gray-700"
                      placeholder="e.g. john@apple.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Subject of Inquiry</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                >
                  <option value="">Select a subject</option>
                  <option value="reservation">Reservation Inquiry</option>
                  <option value="menu">Menu Question</option>
                  <option value="catering">Catering Services</option>
                  <option value="event">Private Events</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Interactive map would be displayed here</p>
                <p className="text-sm text-gray-400 mt-2">123 Food Street, City, State 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
