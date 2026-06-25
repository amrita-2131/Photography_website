import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    // Load Google Fonts & Material Symbols dynamically if not already present
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap',
    ];
    fonts.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // Parallax effect
    const handleMouseMove = (e) => {
      const collageImgs = document.querySelectorAll('.collage-img');
      if (!collageImgs.length) return;
      const x = (e.clientX - window.innerWidth / 2) / 100;
      const y = (e.clientY - window.innerHeight / 2) / 100;
      collageImgs.forEach((img, index) => {
        const factor = (index + 1) * 0.5;
        img.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(form.email, form.password);
      if (loggedUser.role !== 'admin') {
        setError('Access denied. This portal is for administrators only.');
        return;
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        .admin-login-root { min-height: 100vh; display: flex; background: #fff8f7; }
        .collage-img { transition: transform 0.1s ease-out; }
        .custom-shadow { box-shadow: 0 40px 40px -15px rgba(200,142,167,0.04); }
        .msymbol {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          font-size: 20px; line-height: 1;
        }
        /* Floating label */
        .float-input { position: relative; }
        .float-input input { width: 100%; background: transparent; border: none; border-bottom: 1px solid #d4c2c7; padding: 12px 0 8px; font-family: 'Montserrat', sans-serif; font-size: 16px; color: #4A3F35; outline: none; transition: border-color 0.2s; }
        .float-input input:focus { border-color: #814f66; }
        .float-input label { position: absolute; left: 0; top: 12px; font-size: 11px; letter-spacing: 0.1em; font-weight: 500; color: #827378; cursor: text; transition: all 0.2s; pointer-events: none; }
        .float-input input:focus ~ label,
        .float-input input:not(:placeholder-shown) ~ label { transform: translateY(-20px) scale(0.85); transform-origin: left; color: #814f66; }
      `}</style>

      <main className="admin-login-root">
        {/* Left: Collage */}
        <section style={{ display: 'none', position: 'relative', background: '#4A3F35', overflow: 'hidden', flex: '0 0 50%' }}
          className="lg-show">
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 32, opacity: 0.6 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <img referrerPolicy="no-referrer" className="collage-img" alt="Elegant wedding portrait" style={{ width: '100%', height: '40%', objectFit: 'cover', borderRadius: 12 }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC62QG2qJF878c9UzFhS4c720Rq7yQBI9yvbHr923_iTvhJHL3Rt8XqubMYT6JrsBjoofhaVix3qk8troVB3RrEeb_dH_AaxufS_ePJC_YaD6Mnlhucc4u9j59pU26ZA1DNiV87mFe5KIAj03ETd1b72RrVdhjY5S_OfNNic2CFgDE1FAlvsZIEvcIuUQGFCb07fQORiaakqCxu9aQ-vyHahyXsauKohoOziMx7X2_vMw5xiO99VqLcovWIHox_5reCi050Vn2rT7U" />
              <img referrerPolicy="no-referrer" className="collage-img" alt="Serene maternity field portrait" style={{ width: '100%', height: '60%', objectFit: 'cover', borderRadius: 12 }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW0lF3w62f6zAW4hfRd4VfCIZhcZhT-XqcDuUlmbIEaOWSWzFtWTWJvnkKGWCrs8M1BqSj_VPVwPI1UtDdiIF7p0NeBmOxdtFOa2cQynkRSAQ3vip0O4agCuTaqU5qsHYmNS-Oz1iVdtjL1gdQM27-ndE_szpfBKNk3K3l8b-HquE_7smC4PyJwFEquXf40qpCu4B6GwUdCKTHoDJiCnJvmqFeztuos-GPwovu15mTFC3QaL2PH5efCoq3AjDjRGaM-4jlAo1IkKY" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 48 }}>
              <img referrerPolicy="no-referrer" className="collage-img" alt="Joyful birthday celebration" style={{ width: '100%', height: '60%', objectFit: 'cover', borderRadius: 12 }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSUe1OxRi1WbytFb_ELCzNbhP3BazPeRXH3JZ00vYdL7ITO4Z10xjTSr4CNZV9eFJwzFcq2N6TwF2lWLnTIeGk2YYPJSSzv01f7_C5AzqXhm3ZwaF0mpnBQAjYLYweXRYTxkiRloHCqXOePY8oWfcxJvEeagJLyG3fcNll_BpYgBzGgVfpn-YVC9N0wRAo3iw6RuFZU_3r7W12KMtyzQYOody-nrbifaNHa3TS1w6lzNdrNUkCr0WY_XVjPz4rcLuIuBF1_IWm4kU" />
              <img referrerPolicy="no-referrer" className="collage-img" alt="Distinguished graduation portrait" style={{ width: '100%', height: '40%', objectFit: 'cover', borderRadius: 12 }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3KUFwmnuG_QLWtlWutoUsW4B_gZzBGUXE3JFuUh77p6DfiflCvgbMX44W2X9bN0tn3h9IbbiV6zYckLbC2KO2jxRO4YyfdNCo7MXzWXxw9j2NUCVM4Wm_FaIODkPdBLQoHtbjTylvdlK83PxD_E6blRZci1gKiDn_N0V9bJhy_7FfH8W0fPpQqZvnTy7u4VOopiNUhFATOCZahw-6AH8x-1jQlX9DY2CmWVMJdWq1P5369gcqDZq6_NNJd-kFji9SYKuaay0qIiM" />
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: '#E8A0BF', opacity: 0.4, mixBlendMode: 'multiply' }} />
          <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', background: 'linear-gradient(to top, rgba(74,63,53,0.4), transparent)' }}>
            <div style={{ maxWidth: 400 }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 64, lineHeight: 1.1, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.2)', marginBottom: 32 }}>Welcome Back</h1>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
                Manage bookings, customers, galleries, and photography services from one place. Your creative hub for Pixel Memories.
              </p>
              <div style={{ width: 48, height: 4, background: 'rgba(255,255,255,0.4)', marginTop: 32 }} />
            </div>
          </div>
        </section>

        {/* Right: Login */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '80px 24px', background: '#FFF8F2', minHeight: '100vh' }}>
          {/* Back link */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, letterSpacing: '0.1em', fontWeight: 500, color: '#504348', textDecoration: 'none' }}>
              <span className="msymbol">arrow_back</span>
              Back to Website
            </Link>
          </div>

          {/* Card */}
          <div className="custom-shadow" style={{ width: '100%', maxWidth: 448, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)', padding: 48, borderRadius: 8, margin: 'auto 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#4A3F35', letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 8 }}>PIXEL MEMORIES</h2>
              <span style={{ fontSize: 12, color: '#E8A0BF', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>Admin Portal</span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div className="float-input">
                <input id="admin-email" name="email" type="email" placeholder=" " autoComplete="email" required
                  value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                <label htmlFor="admin-email">EMAIL ADDRESS</label>
              </div>
              <div className="float-input">
                <input id="admin-password" name="password" type="password" placeholder=" " autoComplete="current-password" required
                  value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                <label htmlFor="admin-password">PASSWORD</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, letterSpacing: '0.1em', fontWeight: 500 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#814f66', width: 16, height: 16 }} />
                  <span style={{ color: '#504348' }}>Remember Me</span>
                </label>
                <a href="#" style={{ color: '#5e5e5c', textDecoration: 'none', borderBottom: '1px solid transparent' }}
                  onMouseEnter={e => { e.target.style.color = '#814f66'; e.target.style.borderBottomColor = '#814f66'; }}
                  onMouseLeave={e => { e.target.style.color = '#5e5e5c'; e.target.style.borderBottomColor = 'transparent'; }}>
                  Forgot Password?
                </a>
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#ffdad6', borderLeft: '3px solid #ba1a1a', borderRadius: 4, fontSize: 13, color: '#ba1a1a', marginTop: -16 }}>
                  <span className="msymbol" style={{ fontSize: 16 }}>error</span>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#d4a0b5' : '#E8A0BF', color: '#fff', fontSize: 12, letterSpacing: '0.2em', fontWeight: 500, padding: '16px 0', borderRadius: 4, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', boxShadow: '0 8px 24px rgba(232,160,191,0.2)', transition: 'background 0.2s, transform 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading
                  ? <><span className="msymbol" style={{ fontSize: 18, animation: 'spin 1s linear infinite' }}>progress_activity</span> SIGNING IN…</>
                  : 'SIGN IN'
                }
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          </div>

          {/* Security Footer */}
          <div style={{ width: '100%', maxWidth: 672, marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, paddingTop: 48, borderTop: '1px solid rgba(212,194,199,0.2)', marginBottom: 32 }}>
            {[
              { icon: 'verified_user', label: 'Secure Access' },
              { icon: 'encrypted', label: 'Encrypted Login' },
              { icon: 'lock', label: 'Protected Data' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                <span className="msymbol" style={{ color: '#814f66' }}>{icon}</span>
                <span style={{ fontSize: 11, letterSpacing: '0.1em', fontWeight: 500, color: '#5e5e5c', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
