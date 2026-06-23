import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import ShineBorder from '../components/ShineBorder';
import FlippingCard from '../components/FlippingCard';
import './Services.css';

const SERVICES_BENTO = [
  {
    title: 'Wedding Photography',
    tag: 'Wedding',
    desc: 'Elegant, comprehensive coverage of your special day, capturing both the grand moments and intimate details.',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
    size: 'large',
  },
  {
    title: 'Maternity',
    tag: 'Maternity',
    desc: 'Graceful sessions celebrating the beauty of motherhood.',
    img: '/maternity.jpg',
    size: 'small',
  },
  {
    title: 'Birthday Events',
    tag: 'Birthday',
    desc: 'Joyful documentation of milestones and celebrations.',
    img: '/birthday_services.jpg',
    size: 'medium',
  },
  {
    title: 'School Events',
    tag: 'School',
    desc: 'Professional coverage for annual days and ceremonies.',
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000&auto=format&fit=crop',
    size: 'medium',
  },
  {
    title: 'College Fests',
    tag: 'College',
    desc: 'Dynamic captures of youthful energy and college memories.',
    img: '/college.jpg',
    size: 'medium',
  },
];

const PACKAGES = [
  {
    name: 'Silver',
    subtitle: 'Essential Coverage',
    price: '₹25,000',
    priceNote: 'Starting from',
    features: ['Single Photographer', 'Digital Delivery', 'Basic Retouching'],
    highlight: false,
  },
  {
    name: 'Gold',
    subtitle: 'Comprehensive Storytelling',
    price: '₹50,000 – ₹75,000',
    priceNote: '',
    features: ['Two Photographers', 'Premium Album', 'Advanced Retouching', 'Highlight Video'],
    highlight: true,
  },
  {
    name: 'Platinum',
    subtitle: 'Luxury Experience',
    price: '₹75,000 – ₹1,00,000+',
    priceNote: '',
    features: ['Full Team Coverage', 'Multiple Premium Albums', 'Pre & Post Shoot', 'Cinematic Film'],
    highlight: false,
  },
];

const FAQS = [
  {
    q: 'How do I book a session?',
    a: 'You can initiate a booking by clicking the "Capture Now" button or reaching out through our contact page. We\'ll schedule a brief consultation to discuss your vision and finalize dates.',
  },
  {
    q: 'What is included in each package?',
    a: 'Every package includes high-resolution digital images, an online gallery, and basic retouching. Higher-tier packages include additional hours, secondary photographers, physical albums, and cinematic videos.',
  },
  {
    q: 'How long does photo delivery take?',
    a: 'For standard portrait sessions, delivery is typically within 2-3 weeks. For weddings and large events, you will receive a preview gallery within a week, and final delivery takes 6-8 weeks.',
  },
  {
    q: 'Can packages be customized?',
    a: 'Absolutely. We understand that every event is unique. Our packages serve as a starting point, and we are happy to create a bespoke proposal tailored precisely to your needs.',
  },
  {
    q: 'Do you travel for events?',
    a: 'Yes, we love traveling to capture destination events. Travel and accommodation fees apply for locations outside our primary service area.',
  },
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState(null);
  const pageRef = useReveal();

  useEffect(() => {
    document.title = 'Our Services | Pixel Memories';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper services" ref={pageRef}>
      {/* Hero */}
      <section className="services-hero">
        <div className="container services-hero__inner reveal">
          <span className="text-label-sm services-hero__eyebrow">What We Offer</span>
          <h1 className="text-display-lg">Our Photography Services</h1>
          <p className="text-body-lg services-hero__sub">
            Capturing life's most precious moments with creativity and care. We specialize in turning fleeting instances into timeless, elegant memories.
          </p>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="bento-section">
        <div className="container">
          <div className="bento-grid reveal">
            {SERVICES_BENTO.map(({ title, tag, desc, img, size }, i) => (
              <FlippingCard
                key={i}
                className={`bento-card bento-card--${size} img-zoom`}
                frontContent={
                  <>
                    <img referrerPolicy="no-referrer" src={img} alt={title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="img-overlay" />
                    <div className="bento-card__content">
                      <span className="badge">{tag}</span>
                      <h3 className="text-headline-sm bento-card__title">{title}</h3>
                    </div>
                  </>
                }
                backContent={
                  <>
                    <img referrerPolicy="no-referrer" src={img} alt={title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1 }} />
                    <div className="bento-card__content" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', background: 'rgba(31, 26, 27, 0.85)', backdropFilter: 'blur(8px)' }}>
                      <span className="badge" style={{ marginBottom: 16, alignSelf: 'flex-start' }}>{tag}</span>
                      <h3 className="text-headline-sm bento-card__title" style={{ marginBottom: 12 }}>{title}</h3>
                      <p className="text-body-md bento-card__desc">{desc}</p>
                      <Link to="/booking" className="text-label-sm bento-card__link" style={{ marginTop: 'auto' }}>
                        Book Now <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                      </Link>
                    </div>
                  </>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="packages-section">
        <div className="container">
          <div className="packages-section__header reveal">
            <h2 className="text-headline-lg">Investment</h2>
            <p className="text-body-md packages-section__sub">
              Transparent pricing designed to suit various requirements, ensuring every detail is perfectly captured.
            </p>
          </div>
          <div className="packages-grid">
            {PACKAGES.map(({ name, subtitle, price, priceNote, features, highlight }, i) => {
              const cardContent = (
                <div className="package-card__inner" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {highlight && <div className="text-label-sm package-card__popular">Most Popular</div>}
                  <h3 className="text-headline-md package-card__name">{name}</h3>
                  <p className="text-body-md package-card__subtitle">{subtitle}</p>
                  <div className="package-card__price">
                    {priceNote && <span className="text-body-md">{priceNote}<br /></span>}
                    <span className="text-headline-md package-card__amount">{price}</span>
                  </div>
                  <ul className="package-card__features">
                    {features.map((f, j) => (
                      <li key={j} className="text-body-md package-card__feature">
                        <span className="material-symbols-outlined" style={{ color: highlight ? 'var(--color-primary)' : 'var(--color-primary-container)', fontSize: 16 }}>check</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking" className={highlight ? 'btn-primary' : 'btn-ghost'} style={{ width: '100%', marginTop: 'auto', justifyContent: 'center' }}>
                    Get Started
                  </Link>
                </div>
              );

              return highlight ? (
                <ShineBorder key={i} className={`package-card reveal soft-shadow package-card--highlight`} borderWidth={3}>
                  {cardContent}
                </ShineBorder>
              ) : (
                <div key={i} className={`package-card reveal soft-shadow`}>
                  {cardContent}
                </div>
              );
            })}
          </div>
          <p className="text-body-md packages-note reveal">
            Note: Final pricing depends on event duration, location, and custom requirements. Contact us for a personalized quote.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container faq-section__inner">
          <h2 className="text-headline-lg faq-section__title reveal">Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="faq-item reveal">
                <button
                  className="faq-item__btn text-body-lg"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{q}</span>
                  <span className={`material-symbols-outlined faq-item__icon ${openFaq === i ? 'faq-item__icon--open' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className={`faq-item__answer ${openFaq === i ? 'faq-item__answer--open' : ''}`}>
                  <p className="text-body-md">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta reveal">
        <div className="container services-cta__inner">
          <h2 className="text-display-lg services-cta__title">Ready to Freeze Memories?</h2>
          <p className="text-body-lg services-cta__sub">Let's discuss how we can capture your story perfectly.</p>
          <Link to="/booking" className="btn-primary" style={{ padding: '18px 56px' }}>Capture Now</Link>
        </div>
      </section>
    </div>
  );
}
