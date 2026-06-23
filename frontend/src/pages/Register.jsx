import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; /* reuses the same auth CSS */

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(returnTo, { replace: true });
  }, [user, navigate, returnTo]);

  useEffect(() => {
    document.title = 'Create Account | Pixel Memories';
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = form;

    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');
    try {
      await register({ name, email, phone, password });
      navigate(returnTo, { replace: true });
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
            <img referrerPolicy="no-referrer" className="login-panel-left__img" style={{ height: '35%' }} alt="Maternity session"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW0lF3w62f6zAW4hfRd4VfCIZhcZhT-XqcDuUlmbIEaOWSWzFtWTWJvnkKGWCrs8M1BqSj_VPVwPI1UtDdiIF7p0NeBmOxdtFOa2cQynkRSAQ3vip0O4agCuTaqU5qsHYmNS-Oz1iVdtjL1gdQM27-ndE_szpfBKNk3K3l8b-HquE_7smC4PyJwFEquXf40qpCu4B6GwUdCKTHoDJiCnJvmqFeztuos-GPwovu15mTFC3QaL2PH5efCoq3AjDjRGaM-4jlAo1IkKY" />
            <img referrerPolicy="no-referrer" className="login-panel-left__img" style={{ height: '65%' }} alt="Wedding portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgt0AlzwqWyDIE-rgYdIrptEW5EEw2cNajB5_KgqkhnDaElBLfXtbsK6X64Vfk8WS1a2vDcsbPWigyXO7iWnxUwKYWfWOasuA9QiQxM3XQE8KM0e9xayRFI18GURXpC2fyP0YHpaza0jFDi_bEw-DkbmNFvzRqQ1zexWDsih0HmLYLyEkfLUMDoK1qX9wYL8aRH5Urxi6R3Pgs7ObzlceqY5Z-rdkTKgRdsbYCvwBMsBoS8rICGRpyc1cPJRm3sIhNuxO-xt4KH40" />
          </div>
          <div className="login-panel-left__col login-panel-left__col--offset">
            <img referrerPolicy="no-referrer" className="login-panel-left__img" style={{ height: '55%' }} alt="Birthday celebration"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSUe1OxRi1WbytFb_ELCzNbhP3BazPeRXH3JZ00vYdL7ITO4Z10xjTSr4CNZV9eFJwzFcq2N6TwF2lWLnTIeGk2YYPJSSzv01f7_C5AzqXhm3ZwaF0mpnBQAjYLYweXRYTxkiRloHCqXOePY8oWfcxJvEeagJLyG3fcNll_BpYgBzGgVfpn-YVC9N0wRAo3iw6RuFZU_3r7W12KMtyzQYOody-nrbifaNHa3TS1w6lzNdrNUkCr0WY_XVjPz4rcLuIuBF1_IWm4kU" />
            <img referrerPolicy="no-referrer" className="login-panel-left__img" style={{ height: '45%' }} alt="Graduation"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3KUFwmnuG_QLWtlWutoUsW4B_gZzBGUXE3JFuUh77p6DfiflCvgbMX44W2X9bN0tn3h9IbbiV6zYckLbC2KO2jxRO4YyfdNCo7MXzWXxw9j2NUCVM4Wm_FaIODkPdBLQoHtbjTylvdlK83PxD_E6blRZci1gKiDn_N0V9bJhy_7FfH8W0fPpQqZvnTy7u4VOopiNUhFATOCZahw-6AH8x-1jQlX9DY2CmWVMJdWq1P5369gcqDZq6_NNJd-kFji9SYKuaay0qIiM" />
          </div>
        </div>
        <div className="login-panel-left__overlay" />
        <div className="login-panel-left__content">
          <h1 className="login-panel-left__title">Begin Your Journey</h1>
          <p className="login-panel-left__subtitle">
            Create your account and unlock a world of bespoke photography experiences tailored exclusively for you.
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

        <div className="auth-card">
          <div className="auth-card__brand">
            <p className="auth-card__brand-name">Pixel Memories</p>
            <span className="auth-card__brand-sub">New Account</span>
          </div>

          <h2 className="auth-card__title">Create Account</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="float-field">
              <input
                id="reg-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder=" "
                autoComplete="name"
                required
              />
              <label htmlFor="reg-name">Full Name</label>
            </div>

            <div className="float-field">
              <input
                id="reg-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder=" "
                autoComplete="email"
                required
              />
              <label htmlFor="reg-email">Email Address</label>
            </div>

            <div className="float-field">
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder=" "
                autoComplete="tel"
              />
              <label htmlFor="reg-phone">Phone Number (optional)</label>
            </div>

            <div className="float-field">
              <input
                id="reg-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder=" "
                autoComplete="new-password"
                required
              />
              <label htmlFor="reg-password">Password (min. 6 characters)</label>
            </div>

            <div className="float-field">
              <input
                id="reg-confirm"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                autoComplete="new-password"
                required
              />
              <label htmlFor="reg-confirm">Confirm Password</label>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <span className="material-symbols-outlined" style={{ fontSize: 16, flexShrink: 0 }}>error</span>
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading} style={{ marginTop: 24 }}>
              {loading
                ? <><span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'spin 1s linear infinite' }}>progress_activity</span> Creating Account…</>
                : <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_add</span> Create Account</>
              }
            </button>
          </form>

          <p className="auth-nav">
            Already have an account?{' '}
            <Link to="/login" state={{ returnTo }}>Sign in here</Link>
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
