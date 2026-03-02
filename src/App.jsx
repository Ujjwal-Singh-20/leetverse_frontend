import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Hero from './components/Hero';
import Leaderboard from './components/Leaderboard';
import Connect from './components/Connect';
import Particles from './components/Particles';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import AdminUpload from './pages/AdminUpload';
import Unauthorized from './pages/Unauthorized';
import { LogIn, LogOut, User as UserIcon, Shield } from 'lucide-react';

const Navigation = () => {
  const { user, login, logout, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-background/50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center font-black text-background text-xl">L</div>
        <span className="font-display font-bold text-xl tracking-tighter">LEET<span className="text-accent underline decoration-accent/30 underline-offset-4">VERSE</span></span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest">
        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
        <a href="/#leaderboard" className="hover:text-accent transition-colors">Leaderboard</a>

        {user ? (
          <div className="flex items-center gap-6">
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-2 text-accent hover:opacity-80 transition-all">
                <Shield size={14} /> ADMIN_PORTAL
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-2 hover:text-accent transition-all">
              <UserIcon size={14} /> {user.rollNo}
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-all"
            >
              <LogOut size={14} /> LOGOUT
            </button>
          </div>
        ) : (
          <button
            className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-background transition-all flex items-center gap-2 group"
            onClick={login}
          >
            <LogIn size={14} className="group-hover:translate-x-1 transition-transform" /> REGISTER / LOGIN
          </button>
        )}
      </div>
    </nav>
  );
};

const HomePage = () => (
  <main className="relative z-10">
    <Hero />
    <Leaderboard />
    <Connect />
  </main>
);

function AppContent() {
  const { isUnauthorized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("%c LEETVERSE v1.0 %c INITIATED ", "color: #050505; background: #00ff9d; font-weight: bold;", "color: #00ff9d; background: #111111;");
  }, []);

  useEffect(() => {
    if (isUnauthorized) {
      navigate('/unauthorized');
    }
  }, [isUnauthorized, navigate]);

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-background text-white">
      {/* Visual background layers */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-30" />
      <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-accent/10 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-accent/20 to-transparent pointer-events-none z-0 blur-[120px] opacity-60" />

      <Particles />

      {/* Background terminal scan-line effect - Moved behind content */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.03]">
        <div className="w-full h-1 bg-accent/50 animate-scanline shadow-[0_0_10px_rgba(0,255,157,0.5)]" />
      </div>

      <Navigation />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/admin" element={<AdminUpload />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
