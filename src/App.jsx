import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Hero from './components/Hero';
import Leaderboard from './components/Leaderboard';
import Connect from './components/Connect';
import Particles from './components/Particles';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import AdminUpload from './pages/AdminUpload';
import Unauthorized from './pages/Unauthorized';
import Members from './pages/Members';
import Notes from './pages/Notes';
import ParallaxBackground from './components/ParallaxBackground';
import { LogIn, LogOut, User as UserIcon, Shield, X } from 'lucide-react';

const Navigation = () => {
  const { user, login, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Members', path: '/members' },
    { name: 'Notes', path: '/notes' },
    { name: 'Leaderboard', path: '/#leaderboard' },
  ];

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-background/50">
      <Link to="/" className="flex items-center gap-2 relative z-[60]">
        <img src="/leetverse logo.jpg" alt="LeetVerse Logo" className="w-10 h-10 object-contain rounded-sm" />
        <span className="font-display font-bold text-xl tracking-tighter">
          LEET<span className="text-accent underline decoration-accent/30 underline-offset-4">VERSE</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest">
        {navLinks.map(link => (
          <Link key={link.name} to={link.path} className="hover:text-accent transition-colors">{link.name}</Link>
        ))}

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

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden relative z-[60] p-2 text-accent"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <div className="space-y-1.5 w-6">
          <div className="h-0.5 bg-accent w-full" />
          <div className="h-0.5 bg-accent w-full" />
          <div className="h-0.5 bg-accent w-full" />
        </div>}
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-background z-[55] transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col items-center justify-center p-8 space-y-12`}>
        <div className="flex flex-col items-center gap-8 text-xl font-mono uppercase tracking-[0.3em]">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} onClick={handleLinkClick} className="hover:text-accent transition-colors">{link.name}</Link>
          ))}
        </div>

        <div className="h-[1px] w-12 bg-white/10" />

        <div className="flex flex-col items-center gap-8">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" onClick={handleLinkClick} className="flex items-center gap-2 text-accent font-mono text-sm tracking-widest">
                  <Shield size={18} /> ADMIN_PORTAL
                </Link>
              )}
              <Link to="/profile" onClick={handleLinkClick} className="flex items-center gap-2 text-white font-mono text-sm tracking-widest">
                <UserIcon size={18} /> {user.rollNo}
              </Link>
              <button
                onClick={() => { logout(); handleLinkClick(); }}
                className="flex items-center gap-2 text-red-400 font-mono text-xs tracking-widest"
              >
                <LogOut size={16} /> LOGOUT
              </button>
            </>
          ) : (
            <button
              className="px-8 py-3 border border-accent text-accent font-mono text-sm tracking-widest"
              onClick={() => { login(); handleLinkClick(); }}
            >
              REGISTER / LOGIN
            </button>
          )}
        </div>
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
  const location = useLocation();

  useEffect(() => {
    console.log("%c LeetVerse %c Ready ",
      "color: #050505; background: #00ff9d; font-weight: bold;",
      "color: #00ff9d; background: #111111;");
  }, []);

  useEffect(() => {
    if (isUnauthorized) {
      navigate('/unauthorized');
    }
  }, [isUnauthorized, navigate]);

  // 👇 Scroll to hash target when location changes
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // optional: scroll to top when no hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background selection:bg-accent selection:text-background text-white">
      {/* Visual background layers */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-[0.15]" />
      <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-accent/5 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none z-0 blur-[160px] opacity-40" />

      <ParallaxBackground />
      <Particles />

      {/* Background terminal scan-line effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.015]">
        <div className="w-full h-[0.5px] bg-accent/30 animate-scanline shadow-[0_0_8px_rgba(0,255,157,0.3)]" />
      </div>

      <Navigation />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/admin" element={<AdminUpload />} />
          <Route path="/members" element={<Members />} />
          <Route path="/notes" element={<Notes />} />
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