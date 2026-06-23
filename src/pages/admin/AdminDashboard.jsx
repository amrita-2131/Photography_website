import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import DashboardTab from './tabs/DashboardTab';
import BookingsTab from './tabs/BookingsTab';
import CustomersTab from './tabs/CustomersTab';
import GalleryTab from './tabs/GalleryTab';
import ReviewsTab from './tabs/ReviewsTab';
import MessagesTab from './tabs/MessagesTab';
import SettingsTab from './tabs/SettingsTab';

const NAV_LINKS = [
  { icon: 'dashboard', label: 'Dashboard' },
  { icon: 'calendar_month', label: 'Bookings' },
  { icon: 'group', label: 'Customers' },
  { icon: 'auto_stories', label: 'Gallery' },
  { icon: 'star', label: 'Reviews' },
  { icon: 'mail', label: 'Messages' },
  { icon: 'settings', label: 'Settings' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap',
    ];
    fonts.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardTab />;
      case 'Bookings': return <BookingsTab />;
      case 'Customers': return <CustomersTab />;
      case 'Gallery': return <GalleryTab />;
      case 'Reviews': return <ReviewsTab />;
      case 'Messages': return <MessagesTab />;
      case 'Settings': return <SettingsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: '#fff8f7', minHeight: '100vh' }}>
      <style>{`
        .msymbol {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          font-size: 20px; line-height: 1;
        }
        .luxury-card {
          background: #ffffff;
          border: 1px solid rgba(212,194,199,0.3);
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .luxury-card:hover { border-color: #c88ea7; transform: translateY(-2px); }
        .premium-shadow { box-shadow: 0 10px 30px -10px rgba(129,79,102,0.08); }
        .glass-nav { backdrop-filter: blur(12px); background: rgba(255,248,247,0.85); }
        .admin-sidebar { position: fixed; left: 0; top: 0; height: 100vh; width: 256px; background: #fff8f7; border-right: 1px solid rgba(212,194,199,0.3); z-index: 50; display: flex; flex-direction: column; padding: 40px 32px; }
        .admin-main { margin-left: 256px; padding: 32px 48px; background: #fff8f7; }
        .admin-topbar { position: fixed; top: 0; right: 0; height: 80px; width: calc(100% - 256px); z-index: 40; display: flex; justify-content: space-between; align-items: center; padding: 0 48px; border-bottom: 1px solid rgba(212,194,199,0.2); }
        .stat-card { background: #fff; border: 1px solid rgba(212,194,199,0.3); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 12px; transition: border-color 0.3s, transform 0.3s; }
        .stat-card:hover { border-color: #c88ea7; transform: translateY(-2px); }
        .bar { border-radius: 6px 6px 0 0; width: 100%; }
        .bar:hover { opacity: 0.85; }
        @media (max-width: 1024px) {
          .admin-sidebar { display: none; }
          .admin-main { margin-left: 0; padding: 24px; }
          .admin-topbar { width: 100%; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#814f66', lineHeight: 1.2, marginBottom: 8 }}>Pixel<br />Memories</h1>
          <p style={{ fontSize: 10, color: '#504348', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 500 }}>Bespoke Studio Admin</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {NAV_LINKS.map(({ icon, label }) => {
            const active = activeTab === label;
            return (
              <button key={label} onClick={() => setActiveTab(label)} 
                style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#814f66' : '#504348', textDecoration: 'none', transition: 'color 0.2s', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#814f66'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#504348'; }}>
                <span className="msymbol" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid rgba(212,194,199,0.2)', paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: '#fff', border: '1px solid rgba(212,194,199,0.5)', color: '#814f66', padding: '14px 0', borderRadius: 12, fontSize: 11, letterSpacing: '0.15em', fontWeight: 600, textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fcf1f1'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <span className="msymbol" style={{ fontSize: 18 }}>language</span>
            View Website
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: '#814f66', color: '#fff', padding: '14px 0', borderRadius: 12, fontSize: 11, letterSpacing: '0.15em', fontWeight: 500, textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#66384e'}
            onMouseLeave={e => e.currentTarget.style.background = '#814f66'}>
            <span className="msymbol" style={{ fontSize: 18 }}>logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main" style={{ paddingTop: 104 }}>
        {/* Top Bar */}
        <header className="admin-topbar glass-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fcf1f1', padding: '8px 20px', borderRadius: 999, border: '1px solid rgba(212,194,199,0.2)', width: 384 }}>
            <span className="msymbol" style={{ color: '#504348' }}>search</span>
            <input placeholder="Search appointments, clients, invoices..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontFamily: "'Montserrat', sans-serif", width: '100%', color: '#1f1a1b' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: '#504348' }}>
              <span className="msymbol">notifications</span>
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#814f66', borderRadius: '50%', border: '2px solid #fff8f7' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '1px solid rgba(212,194,199,0.3)', paddingLeft: 32 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#1f1a1b' }}>{user?.name || 'Admin'}</p>
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#504348' }}>Studio Admin</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid #c88ea7', padding: 2 }}>
                <img referrerPolicy="no-referrer" alt="Admin Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" />
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        {renderTab()}

      </main>
    </div>
  );
}
