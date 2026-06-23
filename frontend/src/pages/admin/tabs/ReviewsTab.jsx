const API_BASE = import.meta.env.VITE_API_URL || '';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function ReviewsTab() {
  const { authFetch } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const updateStatus = async (id, approved) => {
    try {
      const res = await authFetch(`${API_BASE}/api/reviews/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ approved }),
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, approved } : r));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      const res = await authFetch(`${API_BASE}/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="luxury-card premium-shadow" style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
      <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(212,194,199,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff8f7' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>Customer Reviews</h2>
      </div>
      <div style={{ padding: 32 }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#504348' }}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#504348' }}>No reviews yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: 24, borderRadius: 12, border: '1px solid rgba(212,194,199,0.3)', background: r.approved ? '#fff' : '#fcf1f1' }}>
                <div style={{ flex: 1, marginRight: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{r.userName}</p>
                    <div style={{ display: 'flex', color: '#fbbf24' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="msymbol" style={{ fontSize: 16, fontVariationSettings: i < r.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: '#504348' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#1f1a1b', lineHeight: 1.6 }}>"{r.comment}"</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {r.approved ? (
                    <button onClick={() => updateStatus(r.id, false)} style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Revoke
                    </button>
                  ) : (
                    <button onClick={() => updateStatus(r.id, true)} style={{ background: '#dcfce7', color: '#15803d', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Approve
                    </button>
                  )}
                  <button onClick={() => deleteReview(r.id)} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
