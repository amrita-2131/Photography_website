import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/about', label: 'About' },
  ];

  const handleCapture = () => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/booking', message: 'Please log in to book a session with Pixel Memories.' } });
    } else {
      navigate('/booking');
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-surface/95 backdrop-blur-md shadow-[0_40px_40px_rgba(200,142,167,0.04)]' : 'bg-surface/80 backdrop-blur-sm'}`}>
      <div className="max-w-container-max-width mx-auto flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20">
        
        {/* Brand Logo */}
        <Link to="/" className="font-headline-md text-headline-md text-primary tracking-tight">
          Pixel Memories
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `font-label-sm text-label-sm uppercase tracking-widest transition-colors duration-300 pb-1 ${isActive ? 'text-primary border-b border-primary/30' : 'text-on-surface-variant hover:text-primary'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Trailing Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/profile'} className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container text-primary font-label-sm border border-outline-variant hover:border-primary transition-colors" title={user.name}>
                {user.role === 'admin' ? <span className="material-symbols-outlined text-sm">admin_panel_settings</span> : initials}
              </Link>
              <button onClick={handleLogout} title="Sign out" className="text-on-surface-variant hover:text-error transition-colors flex items-center">
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest">
              <span className="material-symbols-outlined text-[18px]">person</span>
              Login
            </Link>
          )}

          <button onClick={handleCapture} className="inline-flex items-center justify-center px-8 py-3 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary transition-colors duration-300 rounded-DEFAULT">
            Capture Now
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button aria-label="Toggle Menu" className="md:hidden text-on-surface" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="material-symbols-outlined text-2xl">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-surface border-t border-outline-variant/20 shadow-xl flex flex-col px-margin-mobile py-6 gap-6">
          <div className="flex flex-col gap-4">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `font-label-sm text-label-sm uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          
          <div className="h-px bg-outline-variant/30 w-full"></div>

          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/profile'} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">{user.role === 'admin' ? 'admin_panel_settings' : 'person'}</span>
                  {user.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 font-label-sm text-label-sm uppercase tracking-widest text-error hover:text-on-error-container transition-colors text-left w-full">
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">person</span>
                Login
              </Link>
            )}
            
            <button onClick={handleCapture} className="w-full mt-2 inline-flex items-center justify-center px-8 py-4 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-widest rounded-DEFAULT">
              Capture Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

