import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function SettingsTab() {
  const { user, authFetch } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMsg('');
    try {
      const res = await authFetch('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg('Profile updated successfully.');
      } else {
        const data = await res.json();
        setMsg(data.error || 'Update failed.');
      }
    } catch (e) {
      setMsg('Error updating profile.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="luxury-card premium-shadow" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(212,194,199,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff8f7' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>Admin Profile</h2>
      </div>
      <div style={{ padding: 32, display: 'flex', gap: 48, alignItems: 'flex-start' }}>
        
        {/* Profile Card */}
        <div style={{ flex: 1, padding: 32, background: '#fcf1f1', borderRadius: 16, border: '1px solid rgba(212,194,199,0.3)', textAlign: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', border: '4px solid #c88ea7', margin: '0 auto 16px', padding: 4 }}>
            <img referrerPolicy="no-referrer" alt="Admin Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250&h=250" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1f1a1b', marginBottom: 4 }}>{user?.name || 'Admin'}</h3>
          <p style={{ fontSize: 12, color: '#504348', marginBottom: 16 }}>{user?.email}</p>
          <span style={{ background: '#814f66', color: '#fff', padding: '4px 16px', borderRadius: 999, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {user?.role || 'Admin'}
          </span>
        </div>

        {/* Edit Form */}
        <div style={{ flex: 2 }}>
          <h3 style={{ fontSize: 18, marginBottom: 24, color: '#1f1a1b' }}>Edit Profile Information</h3>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Email Address (Read-Only)</label>
              <input type="email" value={user?.email || ''} readOnly
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.2)', background: '#fcf1f1', color: '#504348', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#504348' }}>Phone Number</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(212,194,199,0.5)', outline: 'none' }} />
            </div>
            
            {msg && <p style={{ fontSize: 13, color: msg.includes('success') ? '#15803d' : '#b91c1c', marginTop: 8 }}>{msg}</p>}
            
            <button type="submit" disabled={updating} style={{ alignSelf: 'flex-start', marginTop: 16, height: 44, background: '#814f66', color: '#fff', border: 'none', borderRadius: 8, padding: '0 32px', cursor: 'pointer', fontWeight: 600 }}>
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
