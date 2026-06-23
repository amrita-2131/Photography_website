const API_BASE = import.meta.env.VITE_API_URL || '';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useReveal from '../hooks/useReveal';
import './Booking.css';

const SESSION_TYPES = [
  { id: 'Wedding', title: 'Wedding Photography', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop' },
  { id: 'Maternity', title: 'Maternity Photography', img: '/maternity.jpg' },
  { id: 'Birthday', title: 'Birthday Photography', img: '/birthday.png' },
  { id: 'School Event', title: 'School Events Photography', img: '/milestone.jpg' },
  { id: 'College Event', title: 'College Events Photography', img: '/milestone.jpg' },
];

const PACKAGES = {
  Silver: {
    id: 'Silver',
    title: 'Silver Package',
    price: 25000,
    priceLabel: 'Starting from ₹25,000',
    suitable: 'Maternity Shoots, Birthdays, Small Events',
    features: ['1 Day Coverage', '1 Photographer', '100+ Edited Photos', 'Digital Gallery Delivery', 'Basic Editing', 'Delivery within 14 Days']
  },
  Gold: {
    id: 'Gold',
    title: 'Gold Package',
    price: 50000,
    priceLabel: '₹50,000 - ₹75,000',
    suitable: 'School Events, College Events, Large Family Functions',
    features: ['1 Full Day Coverage', '2 Professional Photographers', '250+ Edited Photos', 'Premium Editing', 'Digital Gallery', 'Premium Album', 'Delivery within 10 Days'],
    popular: true
  },
  Platinum: {
    id: 'Platinum',
    title: 'Platinum Package',
    price: 85000,
    priceLabel: '₹75,000 - ₹1,00,000+',
    suitable: 'Weddings, Receptions, Multi-Day Events',
    features: ['Multi-Day Coverage', '2–3 Professional Photographers', 'Unlimited Edited Photos', 'Premium Editing', 'Premium Album', 'Drone Photography', 'Cinematic Highlight Video', 'Priority Delivery within 7 Days']
  }
};

const ADDON_PRICES = {
  needAlbum: 5000,
  needDrone: 10000,
  needVideo: 15000
};

export default function Booking() {
  const { user, loading: authLoading, authFetch } = useAuth();
  const navigate = useNavigate();
  const pageRef = useReveal();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  
  const [form, setForm] = useState({
    sessionType: '',
    pkg: '',
    name: '',
    email: '',
    phone: '',
    date: '',
    location: '',
    eventDays: 1,
    guests: 0,
    needAlbum: false,
    needDrone: false,
    needVideo: false,
    message: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    agreed: false
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    document.title = 'Book a Session | Pixel Memories';
    window.scrollTo(0, 0);
  }, [step]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (step === 1 && !form.sessionType) return alert('Please select a service');
    if (step === 2 && !form.pkg) return alert('Please select a package');
    if (step === 3) {
      if (!form.name || !form.email || !form.phone || !form.date || !form.location) {
        return alert('Please fill all required fields');
      }
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const getSubtotal = () => {
    let total = 0;
    if (form.pkg && PACKAGES[form.pkg]) total += PACKAGES[form.pkg].price;
    if (form.needAlbum) total += ADDON_PRICES.needAlbum;
    if (form.needDrone) total += ADDON_PRICES.needDrone;
    if (form.needVideo) total += ADDON_PRICES.needVideo;
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.agreed) return;
    
    setApiError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        subtotal: getSubtotal(),
        tax: 0,
        totalAmount: getSubtotal(),
        paymentStatus: 'Paid',
        transactionId: `TXN-${Date.now().toString().slice(-6)}`
      };

      const res = await authFetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error && data.error.toLowerCase().includes('required')) {
          setApiError('Please fill out all required fields before confirming.');
        } else {
          setApiError('We could not process your booking at this time. Please try again.');
        }
      } else {
        setBookingSuccess(data.booking);
        setStep(6); // Success page
      }
    } catch (err) {
      setApiError('Network error. Please check your connection and try again.');
      setStep(7); // Failure page
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper booking-page" ref={pageRef}>
      <section className="booking-hero reveal">
        <div className="blob" style={{ width: 600, height: 600, top: '-20%', right: '-5%', background: 'rgba(200,142,167,0.12)' }} />
        <div className="container booking-hero__inner">
          <span className="text-label-sm booking-hero__eyebrow">Reserve Your Date</span>
          <h1 className="text-display-lg">Book Your Photography Session</h1>
          <p className="text-body-lg booking-hero__sub">
            Let's capture your most precious moments beautifully and create memories that last forever.
          </p>
        </div>
      </section>

      <section className="booking-main">
        <div className="container booking-main__grid" style={{ display: 'block', maxWidth: 900, margin: '0 auto' }}>
          
          {authLoading ? (
             <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading...</div>
          ) : !user ? (
             <div className="booking-auth-prompt" style={{ padding: '48px', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 40px 60px rgba(200,142,167,0.05)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-primary)', marginBottom: 24 }}>lock_person</span>
                <h2 className="text-headline-md" style={{ marginBottom: 12 }}>Client Portal Access Required</h2>
                <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                  Please sign in to your account before continuing with your booking and payment.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/login" state={{ returnTo: '/booking' }} className="btn-primary">Sign In to Book</Link>
                  <Link to="/register" state={{ returnTo: '/booking' }} className="btn-ghost">Create Free Account</Link>
                </div>
              </div>
          ) : (
            <>
              {step <= 5 && (
                <div className="booking-progress reveal">
                  {['Service', 'Package', 'Details', 'Summary', 'Payment'].map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div className={`booking-progress__step ${step === i + 1 ? 'active' : step > i + 1 ? 'completed' : ''}`}>
                        {i + 1}. {s}
                      </div>
                      {i < 4 && <div className="booking-progress__line" />}
                    </div>
                  ))}
                </div>
              )}

              <div className="booking-form-wrap reveal">
                
                {/* Step 1 */}
                {step === 1 && (
                  <div>
                    <h2 className="booking-form__title text-headline-md">Choose Service</h2>
                    <div className="booking-services-grid">
                      {SESSION_TYPES.map(s => (
                        <div 
                          key={s.id} 
                          className={`booking-service-card ${form.sessionType === s.id ? 'selected' : ''}`}
                          onClick={() => setForm(prev => ({ ...prev, sessionType: s.id }))}
                        >
                          <img src={s.img} alt={s.id} />
                          <div className="booking-service-card__content">
                            <h3 className="text-headline-sm">{s.title || s.id}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 32, textAlign: 'right' }}>
                      <button className="btn-primary" onClick={nextStep} disabled={!form.sessionType}>Continue</button>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div>
                    <h2 className="booking-form__title text-headline-md">Choose Package</h2>
                    <div className="booking-packages-grid">
                      {Object.values(PACKAGES).map(p => (
                        <div 
                          key={p.id} 
                          className={`booking-package-card ${form.pkg === p.id ? 'selected' : ''} ${p.popular ? 'popular' : ''}`}
                          onClick={() => setForm(prev => ({ ...prev, pkg: p.id }))}
                        >
                          {p.popular && <div className="booking-package__badge">Most Popular</div>}
                          <h3 className="text-headline-sm">{p.title}</h3>
                          <div className="text-label-lg" style={{ color: 'var(--color-primary)', marginTop: 8 }}>{p.priceLabel}</div>
                          <p className="text-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: 12, marginBottom: 24 }}>Suitable for: {p.suitable}</p>
                          <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {p.features.map((f, i) => (
                              <li key={i} style={{ display: 'flex', gap: 8, fontSize: 14 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-primary)' }}>check</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                      <button className="btn-ghost" onClick={prevStep}>Back</button>
                      <button className="btn-primary" onClick={nextStep} disabled={!form.pkg}>Continue</button>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div>
                    <h2 className="booking-form__title text-headline-md">Event Details</h2>
                    <div className="booking-form">
                      <div className="booking-form__row">
                        <div className="booking-form__field">
                          <label className="form-label">Full Name *</label>
                          <input type="text" name="name" value={form.name} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="booking-form__field">
                          <label className="form-label">Email Address *</label>
                          <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="booking-form__field">
                          <label className="form-label">Phone Number *</label>
                          <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="booking-form__field">
                          <label className="form-label">Event Date *</label>
                          <input type="date" name="date" value={form.date} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="booking-form__field">
                          <label className="form-label">Event Location *</label>
                          <input type="text" name="location" value={form.location} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="booking-form__field">
                          <label className="form-label">Number of Days *</label>
                          <input type="number" min="1" name="eventDays" value={form.eventDays} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="booking-form__field">
                          <label className="form-label">Number of Guests</label>
                          <input type="number" min="0" name="guests" value={form.guests} onChange={handleChange} className="form-input" />
                        </div>
                      </div>

                      <h3 className="text-headline-sm" style={{ marginTop: 24, marginBottom: 16 }}>Additional Services</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                          <input type="checkbox" name="needAlbum" checked={form.needAlbum} onChange={handleChange} style={{ width: 20, height: 20 }} />
                          <span className="text-body-lg">Need Premium Album (+₹5,000)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                          <input type="checkbox" name="needDrone" checked={form.needDrone} onChange={handleChange} style={{ width: 20, height: 20 }} />
                          <span className="text-body-lg">Need Drone Coverage (+₹10,000)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                          <input type="checkbox" name="needVideo" checked={form.needVideo} onChange={handleChange} style={{ width: 20, height: 20 }} />
                          <span className="text-body-lg">Need Cinematic Video (+₹15,000)</span>
                        </label>
                      </div>

                      <div className="booking-form__field booking-form__field--full" style={{ marginTop: 24 }}>
                        <label className="form-label">Additional Notes</label>
                        <textarea name="message" value={form.message} onChange={handleChange} className="form-input" rows="4" placeholder="Any special requests or details..." />
                      </div>
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                      <button className="btn-ghost" onClick={prevStep}>Back</button>
                      <button className="btn-primary" onClick={nextStep}>Continue to Summary</button>
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <div>
                    <h2 className="booking-form__title text-headline-md">Booking Summary</h2>
                    <div className="booking-summary-box">
                      <div className="booking-summary-row">
                        <span>Selected Service</span>
                        <strong>{SESSION_TYPES.find(s => s.id === form.sessionType)?.title || form.sessionType}</strong>
                      </div>
                      <div className="booking-summary-row">
                        <span>Selected Package</span>
                        <strong>{PACKAGES[form.pkg]?.title} (₹{PACKAGES[form.pkg]?.price.toLocaleString()})</strong>
                      </div>
                      <div className="booking-summary-row">
                        <span>Event Date & Location</span>
                        <strong>{form.date} | {form.location}</strong>
                      </div>
                      <div className="booking-summary-row">
                        <span>Duration</span>
                        <strong>{form.eventDays} Day(s)</strong>
                      </div>
                      <div className="booking-summary-row">
                        <span>Contact Information</span>
                        <div style={{ textAlign: 'right' }}>
                          <div>{form.name}</div>
                          <div className="text-body-sm text-on-surface-variant">{form.email}</div>
                          <div className="text-body-sm text-on-surface-variant">{form.phone}</div>
                        </div>
                      </div>
                      {form.needAlbum && (
                        <div className="booking-summary-row text-primary">
                          <span>Premium Album</span>
                          <strong>₹5,000</strong>
                        </div>
                      )}
                      {form.needDrone && (
                        <div className="booking-summary-row text-primary">
                          <span>Drone Photography</span>
                          <strong>₹10,000</strong>
                        </div>
                      )}
                      {form.needVideo && (
                        <div className="booking-summary-row text-primary">
                          <span>Cinematic Video</span>
                          <strong>₹15,000</strong>
                        </div>
                      )}
                      <div className="booking-summary-row total">
                        <span>Total Amount Payable</span>
                        <span>₹{getSubtotal().toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                      <button className="btn-ghost" onClick={prevStep}>Edit Booking</button>
                      <button className="btn-primary" onClick={nextStep}>Continue to Payment</button>
                    </div>
                  </div>
                )}

                {/* Step 5 */}
                {step === 5 && (
                  <form onSubmit={handleSubmit}>
                    <h2 className="booking-form__title text-headline-md">Payment Details</h2>
                    
                    <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)' }}>
                        <span className="material-symbols-outlined">lock</span>
                        <span className="text-label-sm uppercase tracking-wider">SSL Secured Payment</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)' }}>
                        <span className="material-symbols-outlined">shield</span>
                        <span className="text-label-sm uppercase tracking-wider">100% Safe Transactions</span>
                      </div>
                    </div>

                    <div className="booking-summary-box">
                      <div className="booking-summary-row total" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
                        <span>Amount to Pay</span>
                        <span>₹{getSubtotal().toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="booking-form">
                      <div className="booking-form__row">
                        <div className="booking-form__field booking-form__field--full">
                          <label className="form-label">Card Number *</label>
                          <input type="text" name="cardNumber" value={paymentForm.cardNumber} onChange={handlePaymentChange} className="form-input" placeholder="0000 0000 0000 0000" required />
                        </div>
                        <div className="booking-form__field booking-form__field--full">
                          <label className="form-label">Card Holder Name *</label>
                          <input type="text" name="cardName" value={paymentForm.cardName} onChange={handlePaymentChange} className="form-input" placeholder="John Doe" required />
                        </div>
                        <div className="booking-form__field">
                          <label className="form-label">Expiry Date *</label>
                          <input type="text" name="expiry" value={paymentForm.expiry} onChange={handlePaymentChange} className="form-input" placeholder="MM/YY" required />
                        </div>
                        <div className="booking-form__field">
                          <label className="form-label">CVV *</label>
                          <input type="password" name="cvv" value={paymentForm.cvv} onChange={handlePaymentChange} className="form-input" placeholder="123" required />
                        </div>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginTop: 16 }}>
                        <input type="checkbox" name="agreed" checked={paymentForm.agreed} onChange={handlePaymentChange} style={{ width: 20, height: 20, flexShrink: 0 }} />
                        <span className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                          I agree to the Terms & Conditions and Cancellation Policy.
                        </span>
                      </label>
                    </div>

                    {apiError && (
                      <div style={{ marginTop: 24, color: 'var(--color-error)', padding: '12px', background: 'var(--color-error-container)', borderRadius: '8px' }}>
                        {apiError}
                      </div>
                    )}

                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
                      <button type="button" className="btn-ghost" onClick={prevStep} disabled={loading}>Back</button>
                      <button type="submit" className="btn-primary" disabled={!paymentForm.agreed || loading}>
                        {loading ? 'Processing payment...' : 'Pay & Confirm Booking'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 6: Success */}
                {step === 6 && (
                  <div className="booking-success">
                    <span className="material-symbols-outlined booking-success__icon">check_circle</span>
                    <h2 className="text-headline-md">Booking Confirmed!</h2>
                    <p className="text-body-lg">
                      Thank you for choosing Pixel Memories. Your booking has been successfully confirmed and our team will contact you shortly.
                    </p>
                    
                    <div className="booking-summary-box" style={{ width: '100%', textAlign: 'left', marginTop: 24 }}>
                      <div className="booking-summary-row"><span>Booking ID</span><strong>{bookingSuccess?.bookingRef}</strong></div>
                      <div className="booking-summary-row"><span>Transaction ID</span><strong>{bookingSuccess?.transactionId}</strong></div>
                      <div className="booking-summary-row"><span>Service</span><strong>{SESSION_TYPES.find(s => s.id === bookingSuccess?.sessionType)?.title || bookingSuccess?.sessionType}</strong></div>
                      <div className="booking-summary-row"><span>Package</span><strong>{PACKAGES[bookingSuccess?.selectedPackage]?.title}</strong></div>
                      <div className="booking-summary-row"><span>Event Date</span><strong>{bookingSuccess?.date}</strong></div>
                      <div className="booking-summary-row total"><span>Amount Paid</span><span>₹{bookingSuccess?.totalAmount?.toLocaleString()}</span></div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16, justifyContent: 'center' }}>
                      <Link to="/profile" className="btn-primary">View Booking</Link>
                      <button className="btn-ghost" onClick={() => window.print()}>Download Invoice</button>
                      <Link to="/" className="btn-ghost">Back to Home</Link>
                    </div>
                  </div>
                )}

                {/* Step 7: Failure */}
                {step === 7 && (
                  <div className="booking-success">
                    <span className="material-symbols-outlined booking-success__icon" style={{ color: 'var(--color-error)' }}>error</span>
                    <h2 className="text-headline-md">Payment Failed</h2>
                    <p className="text-body-lg">
                      We couldn't process your payment. {apiError}
                    </p>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24, justifyContent: 'center' }}>
                      <button className="btn-primary" onClick={() => setStep(5)}>Try Again</button>
                      <Link to="/contact" className="btn-ghost">Contact Support</Link>
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
