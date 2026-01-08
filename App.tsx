import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import TodoDashboard from './pages/TodoDashboard';
import NotesAppShell from './pages/NotesAppShell';
import { api } from './services/api';
import { User } from './types';

const Navbar: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const location = useLocation();
  if (!user) return null;

  return (
    <nav className="bg-[#111111] border-b border-[#2A2112] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#8B6B1E] rounded-lg animate-golden-pulse flex items-center justify-center text-black font-bold text-xs transform group-hover:scale-110 transition-transform">
                TM
              </div>
              <span className="text-xl font-bold text-[#D4AF37] tracking-tight">TickMark</span>
            </div>
            <div className="hidden sm:flex space-x-6">
              <Link 
                to="/todos" 
                className={`relative px-1 py-2 text-sm font-medium transition-colors ${location.pathname === '/todos' ? 'text-[#D4AF37]' : 'text-slate-400 hover:text-white'}`}
              >
                Super JIRA
                {location.pathname === '/todos' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37] rounded-full" />}
              </Link>
              <Link 
                to="/notes" 
                className={`relative px-1 py-2 text-sm font-medium transition-colors ${location.pathname === '/notes' ? 'text-[#D4AF37]' : 'text-slate-400 hover:text-white'}`}
              >
                Micro Notes
                {location.pathname === '/notes' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37] rounded-full" />}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-xs text-slate-500 font-medium tracking-wide">{user.email}</span>
            <button 
              onClick={onLogout}
              className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A]">
      <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
    </div>
  );

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/auth" element={user ? <Navigate to="/todos" /> : <AuthPage onAuthSuccess={setUser} />} />
            <Route path="/todos" element={user ? <TodoDashboard /> : <Navigate to="/auth" />} />
            <Route path="/notes" element={user ? <NotesAppShell /> : <Navigate to="/auth" />} />
            <Route path="/" element={<Navigate to={user ? "/todos" : "/auth"} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;