'use client';

import { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, register, isLoading } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const loggedInUser = await login(formData.email, formData.password);
        if (loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'staff')) {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        const name = `${formData.firstName} ${formData.lastName}`.trim();
        const registeredUser = await register({
          name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
        });
        if (registeredUser && (registeredUser.role === 'admin' || registeredUser.role === 'staff')) {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 mt-10">
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-600/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg animate-fade-in-up">
        <div className="glass-panel overflow-hidden rounded-[40px] border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 px-10 py-12 text-center border-b border-white/5">
            <Link href="/" className="inline-block group mb-6">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black text-white">D</span>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Delicious</h1>
                  <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase">Premium Dining</span>
                </div>
              </div>
            </Link>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 font-light text-lg">
              {isLogin 
                ? 'Sign in to access your culinary details' 
                : 'Join our exclusive gastronomic community'
              }
            </p>
          </div>

          <div className="px-10 py-12">
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 text-red-400 animate-shake">
                <AlertCircle className="h-6 w-6 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Password</label>
                  {isLogin && <a href="#" className="text-xs font-bold text-amber-500 hover:text-amber-400">Forgot?</a>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-gray-600"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="group w-full bg-white text-black py-5 rounded-3xl font-black text-lg hover:bg-amber-500 hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </form>

            <div className="mt-10 text-center space-y-8">
              <p className="text-gray-500 font-medium">
                {isLogin ? "New to Delicious? " : "Carry a membership? "}
                <button
                  onClick={toggleMode}
                  className="text-amber-500 hover:text-amber-400 font-black decoration-2 underline-offset-4 hover:underline"
                >
                  {isLogin ? 'Join Now' : 'Sign In'}
                </button>
              </p>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-[#0a0a0a] text-gray-500 font-bold tracking-[0.2em] uppercase">Social Connect</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all active:scale-95">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all active:scale-95">
                  <Github className="w-5 h-5" />
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
