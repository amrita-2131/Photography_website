import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useReveal from '../hooks/useReveal';
import './Profile.css';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'booking-status--pending',   icon: 'schedule' },
  confirmed: { label: 'Confirmed', cls: 'booking-status--confirmed', icon: 'check_circle' },
  completed: { label: 'Completed', cls: 'booking-status--completed', icon: 'task_alt' },
  cancelled: { label: 'Cancelled', cls: 'booking-status--cancelled', icon: 'cancel' },
};

export default function Profile() {
  const { user, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const pageRef = useReveal();

  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // Interactive Booking States removed as per single source of truth

  useEffect(() => {
    document.title = 'My Profile | Pixel Memories';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await authFetch('/api/bookings/my');
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch {
        // silently fail
      } finally {
        setBookingsLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [authFetch, user]);

  const upcomingBooking = bookings.find(b => b.status === 'confirmed' || b.status === 'pending' || b.paymentStatus?.toLowerCase() === 'paid');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
    setSaveError('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) { setSaveError('Name cannot be empty.'); return; }
    setSaving(true);
    setSaveError('');
    try {
      const res = await authFetch('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const data = await res.json();
        setSaveError(data.error || 'Failed to update profile.');
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="profile-page page-wrapper" ref={pageRef}>
      {/* Hero */}
      <section className="profile-hero">
        <div className="container profile-hero__inner">
          <div className="profile-hero__avatar">{initials}</div>
          <div className="profile-hero__info">
            <h1 className="profile-hero__name">{user?.name}</h1>
            <p className="profile-hero__email">{user?.email}</p>
            <span className={`profile-hero__badge ${user?.role === 'admin' ? 'profile-hero__badge--admin' : ''}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                {user?.role === 'admin' ? 'admin_panel_settings' : 'person'}
              </span>
              {user?.role === 'admin' ? 'Studio Admin' : 'Client'}
            </span>
          </div>
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="btn-ghost" style={{ alignSelf: 'flex-start' }}>
              Admin Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Main */}
      <section className="profile-main">
        <div className="container">
          {upcomingBooking && (
            <div className="upcoming-booking-widget reveal" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-outline-variant)', padding: 32, borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, marginBottom: 40, boxShadow: '0 20px 40px rgba(200, 142, 167, 0.04)' }}>
              <div>
                <h2 className="text-headline-md mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Client'}!</h2>
                <div className="text-label-sm text-primary uppercase tracking-[0.1em]" style={{ marginBottom: 8 }}>Upcoming Booking</div>
                <h3 className="text-headline-sm">{upcomingBooking.sessionType}</h3>
                <p className="text-body-md text-on-surface-variant mt-1">{upcomingBooking.date ? formatDate(upcomingBooking.date) : 'Date TBD'}</p>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="#booking-history" className="btn-ghost">View Booking</a>
                <Link to="/booking" className="btn-primary">Book Another Session</Link>
              </div>
            </div>
          )}

          <div className="profile-main__grid" id="booking-history">
            {/* Left: Edit profile + logout */}
          <div>
            <div className="profile-panel reveal">
              <h2 className="profile-panel__title">
                <span className="material-symbols-outlined">manage_accounts</span>
                Edit Profile
              </h2>
              <form onSubmit={handleSaveProfile}>
                <div className="profile-field">
                  <label htmlFor="p-name">Full Name</label>
                  <input
                    id="p-name"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="profile-field">
                  <label>Email Address</label>
                  <input type="email" value={user?.email || ''} disabled />
                </div>
                <div className="profile-field">
                  <label htmlFor="p-phone">Phone Number</label>
                  <input
                    id="p-phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="(555) 000-0000"
                  />
                </div>

                {saveError && (
                  <div className="auth-error" style={{ marginBottom: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                    {saveError}
                  </div>
                )}

                <button className="profile-save-btn" type="submit" disabled={saving}>
                  {saving
                    ? <><span className="material-symbols-outlined" style={{ fontSize: 16, animation: 'spin 1s linear infinite' }}>progress_activity</span>Saving…</>
                    : <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>Save Changes</>
                  }
                </button>

                {saveSuccess && (
                  <div className="profile-success">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                    Profile updated successfully.
                  </div>
                )}
              </form>

              <button className="profile-logout-btn" onClick={handleLogout}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                Sign Out
              </button>
            </div>
          </div>

          {/* Right: Booking history */}
          <div>
            <div className="profile-panel reveal">
              <h2 className="profile-panel__title">
                <span className="material-symbols-outlined">calendar_month</span>
                Booking History
              </h2>

              {bookingsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, animation: 'spin 1s linear infinite', color: 'var(--color-primary-container)' }}>progress_activity</span>
                </div>
              ) : bookings.length === 0 ? (
                <div className="profile-empty">
                  <span className="material-symbols-outlined">photo_camera</span>
                  <p className="text-body-md" style={{ marginBottom: 16 }}>No bookings yet.</p>
                  <Link to="/booking" className="btn-primary">Book Your First Session</Link>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map(b => {
                    const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={b.id} className="booking-card soft-shadow">
                        <div className="booking-card__header">
                          <div>
                            <span className="booking-card__ref">Booking ID: {b.bookingRef}</span>
                            <h3 className="booking-card__session">{b.sessionType} Session</h3>
                          </div>
                          <span className={`booking-status ${sc.cls}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{sc.icon}</span>
                            {sc.label}
                          </span>
                        </div>
                        
                        <div className="booking-card__body">
                          <div className="booking-card__detail">
                            <span className="material-symbols-outlined">receipt_long</span>
                            Transaction ID: {b.transactionId || 'N/A'}
                          </div>
                          <div className="booking-card__detail" style={{ width: '100%', marginTop: 8, padding: '12px', background: 'var(--color-surface-container-low)', borderRadius: '8px' }}>
                            <span className="material-symbols-outlined">payments</span>
                            Payment Status: <strong style={{ marginLeft: 6, textTransform: 'capitalize', color: b.paymentStatus?.toLowerCase() === 'paid' ? '#15803d' : '#b45309' }}>{b.paymentStatus || 'Pending'}</strong>
                            {b.totalAmount && <span style={{ marginLeft: 'auto', fontWeight: 600 }}>Amount Paid: ₹{b.totalAmount.toLocaleString()}</span>}
                          </div>
                        </div>

                        <div className="booking-card__actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>
                            View Booking
                          </button>
                          <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => window.print()}>
                            Download Invoice
                          </button>
                          {b.status === 'pending' && (
                            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => alert('Opening Calendly scheduling modal...')}>
                              Schedule Consultation
                            </button>
                          )}
                        </div>

                        <div style={{
                          marginTop: '24px',
                          backgroundColor: '#FFF8F2',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid #F5E6DA',
                          textAlign: 'center'
                        }}>
                          <h4 style={{ color: '#4A3F35', marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>Need help planning your special day?</h4>
                          <p style={{ color: '#4A3F35', marginBottom: '16px', fontSize: '14px', lineHeight: '1.5' }}>
                            Our team would love to understand your vision and create a photography experience that's uniquely yours.
                          </p>
                          <button 
                            className="consultation-card-btn"
                            onClick={() => setShowConsultationModal(true)}
                          >
                            Schedule Consultation
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </section>



      {showConsultationModal && (
        <div className="consultation-modal-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255, 248, 242, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="consultation-modal" style={{
            backgroundColor: '#FFF',
            padding: '40px',
            borderRadius: '16px',
            maxWidth: '450px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(74, 63, 53, 0.08)',
            border: '1px solid #F5E6DA'
          }}>
            <h4 style={{ color: '#4A3F35', fontSize: '16px', marginBottom: '12px', fontWeight: '500' }}>📸 Consultation Request Sent</h4>
            <h3 style={{ color: '#4A3F35', fontSize: '24px', marginBottom: '16px', fontWeight: '600', fontFamily: 'serif' }}>🌿 Your Story Begins Here</h3>
            
            <p style={{ color: '#4A3F35', marginBottom: '12px', fontSize: '15px', lineHeight: '1.6' }}>
              Thank you for choosing Pixel Memories.
            </p>
            <p style={{ color: '#4A3F35', marginBottom: '12px', fontSize: '15px', lineHeight: '1.6' }}>
              We've received your consultation request, and our team will be in touch soon to understand your vision and thoughtfully plan every detail of your special day.
            </p>
            <p style={{ color: '#4A3F35', marginBottom: '32px', fontSize: '15px', lineHeight: '1.6' }}>
              From the first conversation to the final photograph, we're here to turn your moments into memories you'll treasure forever. ✨🤍
            </p>
            
            <button 
              className="consultation-modal-btn"
              onClick={() => {
                setShowConsultationModal(false);
                navigate('/');
              }}
            >
              Back to Home
            </button>

            <p style={{ color: '#4A3F35', fontSize: '12px', opacity: 0.7, fontStyle: 'italic', margin: 0 }}>
              Creating timeless memories, one frame at a time.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .consultation-card-btn {
          background-color: #E8A0BF;
          color: #FFF8F2;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .consultation-card-btn:hover {
          background-color: #d98cb0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(232, 160, 191, 0.3);
        }
        .consultation-modal-btn {
          background-color: #E8A0BF;
          color: #FFF8F2;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-bottom: 24px;
        }
        .consultation-modal-btn:hover {
          background-color: #d98cb0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(232, 160, 191, 0.3);
        }
      `}</style>
    </div>
  );
}
