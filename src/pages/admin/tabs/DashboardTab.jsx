import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function DashboardTab() {
  const { authFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  
  // New Booking form state
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', sessionType: 'Wedding', date: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await authFetch('/api/analytics/dashboard');
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportCSV = async () => {
    try {
      const res = await authFetch('/api/bookings/all');
      const json = await res.json();
      const bookings = json.bookings || [];
      const csvRows = ['Booking ID,Name,Email,Service,Date,Status,Created At'];
      bookings.forEach(b => {
        csvRows.push(`${b.bookingRef},"${b.userName}","${b.userEmail}",${b.sessionType},${b.date},${b.status},${b.createdAt}`);
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'bookings_export.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      alert('Failed to export CSV');
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await authFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingForm),
      });
      if (res.ok) {
        setBookingModalOpen(false);
        setBookingForm({ name: '', email: '', sessionType: 'Wedding', date: '' });
        fetchAnalytics(); // refresh dashboard data
      } else {
        alert('Failed to create booking.');
      }
    } catch (e) {
      alert('Error creating booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#504348' }}>Loading Dashboard Data...</div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Failed to load dashboard data.</div>;

  const STATS_CONFIG = [
    { icon: 'book_online', key: 'total', label: 'Total Bookings' },
    { icon: 'pending_actions', key: 'pending', label: 'Pending', highlight: true },
    { icon: 'event_upcoming', key: 'confirmed', label: 'Confirmed' },
    { icon: 'task_alt', key: 'completed', label: 'Completed' },
    { icon: 'diversity_3', val: data.totalCustomers, label: 'Customers' },
    { icon: 'payments', val: `₹${(data.totalRevenue || 0).toLocaleString()}`, label: 'Revenue' },
  ];

  // Calendar logic
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1); // Monday start
  
  const calendarDays = [];
  for (let i = 0; i < startOffset; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  // Mark dates with upcoming events
  const eventDates = new Set();
  data.upcomingEvents.forEach(e => {
    if (e.date) {
      const d = new Date(e.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        eventDates.add(d.getDate());
      }
    }
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#dcfce7', color: '#15803d' };
      case 'completed': return { bg: '#dbeafe', color: '#1d4ed8' };
      case 'cancelled': return { bg: '#fee2e2', color: '#b91c1c' };
      case 'pending': default: return { bg: '#fef3c7', color: '#b45309' };
    }
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Top Stats Row */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 32 }}>
        {STATS_CONFIG.map(({ icon, key, val, label, highlight }) => (
          <div key={label} className="stat-card luxury-card" style={highlight ? { borderColor: '#c88ea7', background: 'rgba(200,142,167,0.04)' } : {}}>
            <span className="msymbol" style={{ color: '#814f66' }}>{icon}</span>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#814f66', marginBottom: 4 }}>
                {val !== undefined ? val : (data.bookingStats[key] || 0)}
              </p>
              <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#504348' }}>{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Middle Row: Recent Bookings (Left) & Upcoming Calendar (Right) */}
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginBottom: 32 }}>
        
        {/* Recent Bookings */}
        <div className="luxury-card premium-shadow" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(212,194,199,0.2)', background: '#fff8f7' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Recent Bookings</h2>
          </div>
          <div style={{ overflowX: 'auto', padding: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  {['Client', 'Event', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#504348', borderBottom: '1px solid rgba(212,194,199,0.2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentBookings.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: '#504348' }}>No recent bookings.</td></tr>
                ) : data.recentBookings.map(b => {
                  const ss = getStatusStyle(b.status);
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(212,194,199,0.1)' }}>
                      <td style={{ padding: '16px' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1f1a1b' }}>{b.userName}</p>
                      </td>
                      <td style={{ padding: '16px', fontSize: 13, color: '#504348' }}>{b.sessionType}</td>
                      <td style={{ padding: '16px', fontSize: 13, color: '#504348' }}>{b.date || 'TBD'}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ background: ss.bg, color: ss.color, padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="luxury-card premium-shadow" style={{ borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Upcoming Events</h2>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#814f66' }}>{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px 0', textAlign: 'center', marginBottom: 16 }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, color: '#c88ea7' }}>{d}</span>
            ))}
            {calendarDays.map((d, i) => {
              const isEvent = d && eventDates.has(d);
              const isToday = d === today.getDate();
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 32 }}>
                  {d ? (
                    <span style={{
                      width: 28, height: 28, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 12, borderRadius: '50%',
                      background: isEvent ? '#814f66' : (isToday ? 'rgba(200,142,167,0.2)' : 'transparent'),
                      color: isEvent ? '#fff' : (isToday ? '#814f66' : '#504348'),
                      fontWeight: (isEvent || isToday) ? 600 : 400,
                      boxShadow: isEvent ? '0 4px 10px rgba(129,79,102,0.3)' : 'none',
                    }}>
                      {d}
                    </span>
                  ) : <span />}
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid rgba(212,194,199,0.2)', paddingTop: 16 }}>
            {data.upcomingEvents.length === 0 ? (
              <p style={{ fontSize: 12, color: '#504348', textAlign: 'center' }}>No upcoming events scheduled.</p>
            ) : data.upcomingEvents.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 4, height: 24, borderRadius: 2, background: getStatusStyle(e.status).color }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#1f1a1b' }}>{e.date} - {e.sessionType}</p>
                  <p style={{ fontSize: 11, color: '#504348' }}>{e.userName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => setBookingModalOpen(true)} className="luxury-card premium-shadow" style={{ flex: 1, padding: 24, borderRadius: 12, border: '1px dashed #c88ea7', background: '#fffcfc', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span className="msymbol" style={{ color: '#814f66', fontSize: 28 }}>add_circle</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#814f66' }}>New Booking</span>
          </button>
          <button onClick={() => alert('Navigate to Customers Tab to add a client.')} className="luxury-card premium-shadow" style={{ flex: 1, padding: 24, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: 'none' }}>
            <span className="msymbol" style={{ color: '#504348', fontSize: 28 }}>person_add</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1f1a1b' }}>Add Client</span>
          </button>
          <button onClick={handleExportCSV} className="luxury-card premium-shadow" style={{ flex: 1, padding: 24, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: 'none' }}>
            <span className="msymbol" style={{ color: '#504348', fontSize: 28 }}>download</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1f1a1b' }}>Export Data (CSV)</span>
          </button>
          <button onClick={() => window.print()} className="luxury-card premium-shadow" style={{ flex: 1, padding: 24, borderRadius: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: 'none' }}>
            <span className="msymbol" style={{ color: '#504348', fontSize: 28 }}>picture_as_pdf</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1f1a1b' }}>Print PDF</span>
          </button>
        </div>
      </section>

      {/* Studio Recent Activity */}
      <section className="luxury-card premium-shadow" style={{ borderRadius: 16, padding: 32 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 24 }}>Studio Recent Activity</h2>
        {data.activities.length === 0 ? (
          <p style={{ fontSize: 13, color: '#504348' }}>No recent activity to display.</p>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Vertical timeline line */}
            <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: 'rgba(212,194,199,0.3)' }} />
            
            {data.activities.map((act, index) => (
              <div key={act.id} style={{ display: 'flex', gap: 24, marginBottom: index === data.activities.length - 1 ? 0 : 24, position: 'relative' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${act.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, border: '2px solid #fff' }}>
                  <span className="msymbol" style={{ color: act.color, fontSize: 18 }}>{act.icon}</span>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1f1a1b', marginBottom: 4 }}>{act.title}</p>
                  <p style={{ fontSize: 13, color: '#504348', marginBottom: 6 }}>{act.desc}</p>
                  <p style={{ fontSize: 11, color: '#814f66', fontWeight: 500 }}>{new Date(act.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Booking Modal */}
      {isBookingModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(31,26,27,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="luxury-card" style={{ width: 500, borderRadius: 16, overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ padding: '24px 32px', background: '#fff8f7', borderBottom: '1px solid rgba(212,194,199,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>New Booking</h2>
              <button onClick={() => setBookingModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#504348' }}>
                <span className="msymbol">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateBooking} style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Client Name</label>
                <input required type="text" value={bookingForm.name} onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Email</label>
                <input required type="email" value={bookingForm.email} onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Session Type</label>
                <select required value={bookingForm.sessionType} onChange={e => setBookingForm({ ...bookingForm, sessionType: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', outline: 'none', background: '#fff' }}>
                  <option>Wedding</option>
                  <option>Maternity</option>
                  <option>Birthday</option>
                  <option>School Event</option>
                  <option>College Event</option>
                  <option>Life Celebration</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Date</label>
                <input required type="date" value={bookingForm.date} onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', outline: 'none' }} />
              </div>
              <button type="submit" disabled={submitting} style={{ marginTop: 16, height: 44, background: '#814f66', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                {submitting ? 'Creating...' : 'Create Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
