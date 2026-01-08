import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, { email, password });
      onAuthSuccess(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0A]">
      <div className="max-w-4xl w-full bg-[#121212] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row border border-[#2A2112]">
        {/* Marketing Side */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#1A150B] to-[#0D0D0D] p-10 text-white flex flex-col justify-center border-r border-[#2A2112]">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Elevate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">TickMark.</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            TickMark provides a professional secure platform combining elite task tracking with a sophisticated and highly organized digital note archive.
          </p>
          <div className="space-y-5">
            {[ 'Dual-App Integration', 'Shared High-Security Auth', 'Real-time JIRA-style Tasks' ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-4 group">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                </div>
                <span className="text-slate-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Side */}
        <div className="md:w-1/2 p-8 md:p-14 bg-[#121212]">
          <div className="flex mb-10 bg-[#0A0A0A] p-1 rounded-2xl border border-[#2A2112]">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all ${isLogin ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-slate-500 hover:text-slate-200'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all ${!isLogin ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-slate-500 hover:text-slate-200'}`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 bg-[#0A0A0A] border border-[#2A2112] rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-700"
                placeholder="architect@saas.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 bg-[#0A0A0A] border border-[#2A2112] rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-700"
                placeholder="••••••••"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest ml-1">Verify</label>
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-[#0A0A0A] border border-[#2A2112] rounded-xl focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            )}
            
            {error && <div className="text-rose-400 text-xs font-medium bg-rose-500/5 p-4 rounded-xl border border-rose-500/20">{error}</div>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#F3E5AB] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-xl shadow-[#D4AF37]/10"
            >
              {loading ? 'Authenticating...' : (isLogin ? 'Enter Workspace' : 'Begin Journey')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;