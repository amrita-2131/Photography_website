import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function MessagesTab() {
  const { authFetch } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await authFetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id, status) => {
    try {
      const res = await authFetch(`/api/messages/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const res = await authFetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="luxury-card premium-shadow" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(212,194,199,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff8f7' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>Contact Messages</h2>
      </div>
      <div style={{ padding: 32 }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#504348' }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#504348' }}>No messages yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map(m => (
              <div key={m.id} style={{ padding: 24, borderRadius: 12, border: '1px solid', borderColor: m.status === 'unread' ? '#c88ea7' : 'rgba(212,194,199,0.3)', background: m.status === 'unread' ? 'rgba(200,142,167,0.04)' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 16, color: '#1f1a1b', marginBottom: 4 }}>{m.subject}</p>
                    <p style={{ fontSize: 12, color: '#504348' }}>From: <span style={{ fontWeight: 600 }}>{m.name}</span> ({m.email})</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, color: '#504348' }}>{new Date(m.createdAt).toLocaleString()}</span>
                    <select value={m.status} onChange={e => updateStatus(m.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(212,194,199,0.5)', fontSize: 11, outline: 'none' }}>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button onClick={() => deleteMessage(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c' }}>
                      <span className="msymbol" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>
                </div>
                <div style={{ padding: 16, background: '#fcf1f1', borderRadius: 8, fontSize: 13, lineHeight: 1.6, color: '#1f1a1b', whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
