import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const COLLAGE_IMGS = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC62QG2qJF878c9UzFhS4c720Rq7yQBI9yvbHr923_iTvhJHL3Rt8XqubMYT6JrsBjoofhaVix3qk8troVB3RrEeb_dH_AaxufS_ePJC_YaD6Mnlhucc4u9j59pU26ZA1DNiV87mFe5KIAj03ETd1b72RrVdhjY5S_OfNNic2CFgDE1FAlvsZIEvcIuUQGFCb07fQORiaakqCxu9aQ-vyHahyXsauKohoOziMx7X2_vMw5xiO99VqLcovWIHox_5reCi050Vn2rT7U',
    alt: 'Wedding portrait', h: '40%',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW0lF3w62f6zAW4hfRd4VfCIZhcZhT-XqcDuUlmbIEaOWSWzFtWTWJvnkKGWCrs8M1BqSj_VPVwPI1UtDdiIF7p0NeBmOxdtFOa2cQynkRSAQ3vip0O4agCuTaqU5qsHYmNS-Oz1iVdtjL1gdQM27-ndE_szpfBKNk3K3l8b-HquE_7smC4PyJwFEquXf40qpCu4B6GwUdCKTHoDJiCnJvmqFeztuos-GPwovu15mTFC3QaL2PH5efCoq3AjDjRGaM-4jlAo1IkKY',
    alt: 'Maternity portrait', h: '60%',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSUe1OxRi1WbytFb_ELCzNbhP3BazPeRXH3JZ00vYdL7ITO4Z10xjTSr4CNZV9eFJwzFcq2N6TwF2lWLnTIeGk2YYPJSSzv01f7_C5AzqXhm3ZwaF0mpnBQAjYLYweXRYTxkiRloHCqXOePY8oWfcxJvEeagJLyG3fcNll_BpYgBzGgVfpn-YVC9N0wRAo3iw6RuFZU_3r7W12KMtyzQYOody-nrbifaNHa3TS1w6lzNdrNUkCr0WY_XVjPz4rcLuIuBF1_IWm4kU',
    alt: 'Birthday celebration', h: '60%',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3KUFwmnuG_QLWtlWutoUsW4B_gZzBGUXE3JFuUh77p6DfiflCvgbMX44W2X9bN0tn3h9IbbiV6zYckLbC2KO2jxRO4YyfdNCo7MXzWXxw9j2NUCVM4Wm_FaIODkPdBLQoHtbjTylvdlK83PxD_E6blRZci1gKiDn_N0V9bJhy_7FfH8W0fPpQqZvnTy7u4VOopiNUhFATOCZahw-6AH8x-1jQlX9DY2CmWVMJdWq1P5369gcqDZq6_NNJd-kFji9SYKuaay0qIiM',
    alt: 'Graduation portrait', h: '40%',
  },
];

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || '/';
  const message = location.state?.message || null;

  const [form, setForm] = useState({ email: 'admin21@gmail.com', password: '245301', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(returnTo, { replace: true });
      }
    }
  }, [user, navigate, returnTo]);

  useEffect(() => {
    document.title = 'Sign In | Pixel Memories';
    window.scrollTo(0, 0);

    // Parallax on left panel images
    const handleMove = (e) => {
      const imgs = document.querySelectorAll('.login-collage-img');
      const x = (e.clientX - window.innerWidth / 2) / 120;
      const y = (e.clientY - window.innerHeight / 2) / 120;
      imgs.forEach((img, i) => {
        const f = (i + 1) * 0.4;
        img.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const loggedUser = await login(form.email, form.password, form.remember);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(returnTo, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left decorative panel */}
      <section className="login-panel-left">
        <div className="login-panel-left__grid">
          <div className="login-panel-left__col">
            <img referrerPolicy="no-referrer" className="login-collage-img login-panel-left__img" src={COLLAGE_IMGS[0].src} alt={COLLAGE_IMGS[0].alt} style={{ height: COLLAGE_IMGS[0].h }} />
            <img referrerPolicy="no-referrer" className="login-collage-img login-panel-left__img" src={COLLAGE_IMGS[1].src} alt={COLLAGE_IMGS[1].alt} style={{ height: COLLAGE_IMGS[1].h }} />
          </div>
          <div className="login-panel-left__col login-panel-left__col--offset">
            <img referrerPolicy="no-referrer" className="login-collage-img login-panel-left__img" src={COLLAGE_IMGS[2].src} alt={COLLAGE_IMGS[2].alt} style={{ height: COLLAGE_IMGS[2].h }} />
            <img referrerPolicy="no-referrer" className="login-collage-img login-panel-left__img" src={COLLAGE_IMGS[3].src} alt={COLLAGE_IMGS[3].alt} style={{ height: COLLAGE_IMGS[3].h }} />
          </div>
        </div>
        <div className="login-panel-left__overlay" />
        <div className="login-panel-left__content">
          <h1 className="login-panel-left__title">Welcome Back</h1>
          <p className="login-panel-left__subtitle">
            Manage your bookings, view your photography sessions, and continue crafting your most beautiful memories.
          </p>
          <div className="login-panel-left__bar" />
        </div>
      </section>

      {/* Right form panel */}
      <section className="login-panel-right">
        <Link to="/" className="login-panel-right__back">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back to Website
        </Link>

        {/* Auth redirect message */}
        {message && (
          <div className="auth-message-banner">
            <span className="material-symbols-outlined" style={{ fontSize: 18, flexShrink: 0 }}>lock</span>
            {message}
          </div>
        )}

        <div className="auth-card">
          <div className="auth-card__brand">
            <p className="auth-card__brand-name">Pixel Memories</p>
            <span className="auth-card__brand-sub">Client Portal</span>
          </div>

          <h2 className="auth-card__title">Sign In</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="float-field">
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder=" "
                autoComplete="email"
                required
              />
              <label htmlFor="login-email">Email Address</label>
            </div>

            <div className="float-field">
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder=" "
                autoComplete="current-password"
                required
              />
              <label htmlFor="login-password">Password</label>
            </div>

            <div className="auth-helpers">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember Me
              </label>
              <a href="#" className="auth-forgot">Forgot Password?</a>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <span className="material-symbols-outlined" style={{ fontSize: 16, flexShrink: 0 }}>error</span>
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading} style={{ marginTop: error ? 20 : 0 }}>
              {loading
                ? <><span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'spin 1s linear infinite' }}>progress_activity</span> Signing In…</>
                : 'Sign In'
              }
            </button>
          </form>

          <p className="auth-nav">
            Don't have an account?{' '}
            <Link to="/register" state={{ returnTo }}>Create one for free</Link>
          </p>

          <div className="auth-badges">
            {[
              { icon: 'verified_user', label: 'Secure' },
              { icon: 'encrypted', label: 'Encrypted' },
              { icon: 'lock', label: 'Protected' },
            ].map(({ icon, label }) => (
              <div key={label} className="auth-badge">
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-primary-container)' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
