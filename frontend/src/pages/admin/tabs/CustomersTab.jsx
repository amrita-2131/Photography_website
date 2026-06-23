const API_BASE = import.meta.env.VITE_API_URL || '';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function CustomersTab() {
  const { authFetch } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/users/all`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <section className="luxury-card premium-shadow" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(212,194,199,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff8f7' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>Registered Customers</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#fcf1f1' }}>
              {['Name', 'Email', 'Phone', 'Joined', 'Total Bookings'].map(h => (
                <th key={h} style={{ padding: '16px 24px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#504348', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#504348', fontSize: 14 }}>Loading customers…</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#504348', fontSize: 14 }}>No customers found.</td></tr>
            ) : customers.map((c) => {
              const joinedDate = new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
              return (
                <tr key={c.id} style={{ borderTop: '1px solid rgba(212,194,199,0.1)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,142,167,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: '16px 24px', fontSize: 13, color: '#504348' }}>{c.email}</td>
                  <td style={{ padding: '16px 24px', fontSize: 13, color: '#504348' }}>{c.phone || 'N/A'}</td>
                  <td style={{ padding: '16px 24px', fontSize: 13 }}>{joinedDate}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                      {c.totalBookings}
                    </span>
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
