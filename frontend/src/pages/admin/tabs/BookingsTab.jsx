const API_BASE = import.meta.env.VITE_API_URL || '';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function BookingsTab() {
  const { authFetch } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/bookings/all`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await authFetch(`${API_BASE}/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="luxury-card premium-shadow" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(212,194,199,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff8f7' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>All Bookings</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#fcf1f1' }}>
              {['Booking ID', 'Client', 'Package & Addons', 'Date & Location', 'Amount', 'Status', 'Update'].map(h => (
                <th key={h} style={{ padding: '16px 24px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#504348', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#504348', fontSize: 14 }}>Loading bookings…</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#504348', fontSize: 14 }}>No bookings found.</td></tr>
            ) : bookings.map((b) => {
              const STATUS_STYLES = {
                pending:   { color: '#b45309', bg: '#fef3c7' },
                confirmed: { color: '#15803d', bg: '#dcfce7' },
                completed: { color: '#1d4ed8', bg: '#dbeafe' },
                cancelled: { color: '#b91c1c', bg: '#fee2e2' },
              };
              const ss = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
              return (
                <tr key={b.id} style={{ borderTop: '1px solid rgba(212,194,199,0.1)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,142,167,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 24px', fontSize: 12, color: '#504348', fontWeight: 600 }}>#{b.bookingRef}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{b.userName}</p>
                    <p style={{ fontSize: 12, color: '#504348' }}>{b.userEmail}</p>
                    <p style={{ fontSize: 11, color: '#814f66' }}>{b.userPhone}</p>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 13 }}>
                    <p style={{ fontWeight: 600, color: '#1f1a1b' }}>{b.sessionType}</p>
                    <p style={{ color: '#814f66' }}>{b.selectedPackage || 'Custom'} Package</p>
                    <p style={{ fontSize: 11, color: '#504348' }}>
                      {[b.needAlbum && 'Album', b.needDrone && 'Drone', b.needVideo && 'Video'].filter(Boolean).join(', ')}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 13 }}>
                    <p>{b.date || 'TBD'}</p>
                    <p style={{ color: '#504348', fontSize: 12 }}>{b.location || 'Studio'} ({b.eventDays || 1} Days)</p>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: 13 }}>
                    <p style={{ fontWeight: 600 }}>₹{b.totalAmount?.toLocaleString() || 0}</p>
                    <span style={{ fontSize: 10, textTransform: 'uppercase', padding: '2px 6px', background: b.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7', color: b.paymentStatus === 'paid' ? '#15803d' : '#b45309', borderRadius: 4 }}>
                      {b.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ background: ss.bg, color: ss.color, padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <select
                      value={b.status}
                      disabled={updatingId === b.id}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', background: '#fff', fontSize: 12, cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingId === b.id && <span style={{ fontSize: 11, marginLeft: 8, color: '#814f66' }}>Saving...</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
