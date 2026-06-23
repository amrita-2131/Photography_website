import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import './About.css';

const TEAM = [
  {
    name: 'Elena Rose',
    role: 'Founder & Creative Director',
    bio: 'With over a decade in high-fashion editorial, Elena brings a magazine-quality aesthetic to every wedding she shoots.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDThua3769ZdSLAAyew3m2yZ_JflHzAbel0nt_kEYjuhQHN5qM5U-UbGj1fhDvnh4dLw851bXxKebG3Wy1zQ9oxuAvmFGmDH0ullM90Cv43Nxc2V4cezhSNTY1kGr7Ecjakjzu1L88PVmsR6jsxdocT4D5QxjJrOmwu3FVVYZZSpsNvYKNX068TBCbvFbqw_an-YYH77_T7Uj2P2DD0DSGMvOGM9dOKb1sweraTFZj2lvAiOj6MczANBxMIdwQ2Pk4Ah_6JlofpK0Y',
  },
  {
    name: 'Julian Thorne',
    role: 'Senior Lead Photographer',
    bio: 'Julian specializes in candid moments and natural light, capturing the raw, unscripted emotions of life\'s celebrations.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsxx2jsQxOLS6u7CcW1FeeOLbTUL6liIbqczzVKIOYPADHF1zM5Yo2JFIzN_ztKOeMF4ZjRtpV5sckBq_fpHGN7eO_8XsBpi1BPtWPr14w-_SI1EUigvMt8bhYp_klpnGY6E1WnqCnpdM8SMyBWeHgazZekaXExVIJmMrTeD0IfsreP4_2XpR91MYDQSWFNZ_SKZaWHyKdFWAioYiY8-6kucm1IlHHp6H1WopAEGYdMxfFtMZpcX5qYS63PhuZtKz_ztYbrm8MnPc',
  },
  {
    name: 'Sophie Chen',
    role: 'Fine Art Specialist',
    bio: 'Sophie brings a delicate, painterly eye to every frame, specializing in timeless fine art portraits that capture the soul.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZEsZyB6FclpAjkTAibWBMZTKHLRW96EKOYnaEv03SQeP5TrDRSOknYQYhS2S1MxEaxoO2Qiw0WR_EBwilZ2IE9N6x9BPqrxgCXT0n3nJsSdWi193euA7PBDVbFdQvOFN_9hgduNoBKhnbNnCY_2K-wA6XpOEuQX2ca10SRtr4fcJDJ9pm5K3KaEMaMWdAY3PX0lFxGp-6x671B76Txp32qU01v3VxR_9hEWHP092vmApPsxgC_IkDtUoN200KoV-EWtamQiaNOyo',
  },
  {
    name: 'Marcus Vane',
    role: 'Cinematic Videographer',
    bio: 'Marcus transforms still moments into cinematic stories, bringing a motion-picture quality to the Pixel Memories brand.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn7QQTBHegpchfhT8jvZouZrkij5jViN6NGDbl6xTF5xOl3l9ucvmzuVDkl46o7BP_Qf0dS3voOFgnO6RSPJ2_4XYrCS6RLMdq_EjkFqD0E-c4YxEUt87wLh9RCqFJ114smbB2bk9skgUHtYipM9EHdcV1ZFZPX5DSIhluX8dL1kLqqAhOG_hQJPk4aQgBYD08QVLBgnc-SHi7rzOSuo6t77aDzycgvbQhAKeA_5Qz6ZshdnJfu57Ed1AXcDWMezgRSGDCqJLl8ys',
  },
];

const WHY_US = [
  { icon: 'camera_enhance', title: 'Professional Photographers', desc: 'Award-winning artists with a keen eye for lighting and composition.' },
  { icon: 'brush', title: 'Premium Editing', desc: 'Sophisticated post-processing that enhances natural beauty without distortion.' },
  { icon: 'menu_book', title: 'High-Quality Albums', desc: 'Handcrafted heirloom albums printed on archival museum-grade papers.' },
  { icon: 'shutter_speed', title: 'Fast Delivery', desc: 'Efficient workflow ensuring your digital gallery arrives within weeks, not months.' },
  { icon: 'history_edu', title: 'Creative Storytelling', desc: 'We don\'t just take photos; we weave a narrative of your most cherished day.' },
  { icon: 'favorite', title: 'Customer Satisfaction', desc: 'Dedicated support from the first inquiry to the final delivery of your prints.' },
];

const INSTAGRAM = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC7TeVxfKMboizcVfG9FtVI6mIkbFat9OWMv5kR70eNjoAc7TeK58I8leMk6PreWStt5IuWONDBB0HFAoFzQLFkmYrL3Gk-gIEGDqcY9pPKUeULoxoNkVOm3nb_nQBwr8C42BYoBN_F-zhFc88QHOZH4sOJE22BW046OOo5qtOgB7WUx4eLI5XfyNXWHKTVFFCoZ66afn2yupUDmZY0BrVf_UNc-BPFavcRDIQmB2Tu9NfBJ-P1sOTu0lvA1oKErAr1tENEbYA-8Nk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBKvhDxhb2iPmYfPTSkXTqrCW0JA7e0CpZlrz3NndZQH8j4NYXX_uKF9ABmEobrIhGkhqVQHVpmdy4BJLmSnja0-t_q178mKAQ-YDNMjo3e3FSYZ2tW8nZcnVVO2uTFdDwiSemQ_rLRhRfWtmw0T2wkVRqyBXudyLhmnVfzqLnoXUPYf3YkVTxDQ96_rI7ZwN6W4LyESn82QqSTFQiwhPZXTVl6GADPWdJcCUems8NKX0_Fiy3_WveuUF1i7BzboEmPa65rmgdxcfU',
];

export default function About() {
  const pageRef = useReveal();

  useEffect(() => {
    document.title = 'About & Contact | Pixel Memories';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper about-page" ref={pageRef}>
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__img img-zoom">
          <img referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury wedding photography couple"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(31,26,27,0.55) 100%)' }} />
        </div>
        <div className="about-hero__content reveal">
          <h1 className="text-display-lg">About Pixel Memories</h1>
          <p className="text-body-lg">
            Capturing emotions, celebrations, and life's most precious moments through timeless photography.
          </p>
        </div>
      </section>

      {/* Studio Story */}
      <section className="studio-story">
        <div className="container studio-story__grid">
          <div className="studio-story__text reveal">
            <span className="text-label-sm studio-story__eyebrow">Our Journey</span>
            <h2 className="text-headline-lg">Crafting Visual Legacies</h2>
            <div className="studio-story__line" />
            <p className="text-body-lg studio-story__body">
              What started as a simple passion for frames has evolved into a premium studio dedicated to the art of memory preservation. We believe every glance, laugh, and tear tells a unique story that deserves to be told with elegance.
            </p>
            <div className="studio-story__stats">
              <div>
                <div className="text-headline-md studio-story__stat-num">12+</div>
                <div className="text-label-sm studio-story__stat-label">Years of Experience</div>
              </div>
              <div>
                <div className="text-headline-md studio-story__stat-num">500+</div>
                <div className="text-label-sm studio-story__stat-label">Stories Captured</div>
              </div>
            </div>
          </div>
          <div className="studio-story__image-wrap reveal">
            <div className="studio-story__image img-zoom">
              <img referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsxx2jsQxOLS6u7CcW1FeeOLbTUL6liIbqczzVKIOYPADHF1zM5Yo2JFIzN_ztKOeMF4ZjRtpV5sckBq_fpHGN7eO_8XsBpi1BPtWPr14w-_SI1EUigvMt8bhYp_klpnGY6E1WnqCnpdM8SMyBWeHgazZekaXExVIJmMrTeD0IfsreP4_2XpR91MYDQSWFNZ_SKZaWHyKdFWAioYiY8-6kucm1IlHHp6H1WopAEGYdMxfFtMZpcX5qYS63PhuZtKz_ztYbrm8MnPc"
                alt="Photographer's workspace"
              />
            </div>
            <div className="studio-story__blob" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="container">
          <h2 className="text-headline-lg mission-section__title reveal">Preserving Memories with Excellence</h2>
          <div className="mission-section__grid">
            <div className="mission-card reveal soft-shadow">
              <span className="material-symbols-outlined mission-card__icon">auto_awesome</span>
              <h3 className="text-headline-md">Our Mission</h3>
              <p className="text-body-lg">
                To provide an unparalleled photography experience that celebrates the beauty of human connection through artistic vision and technical precision.
              </p>
            </div>
            <div className="mission-card reveal soft-shadow">
              <span className="material-symbols-outlined mission-card__icon">visibility</span>
              <h3 className="text-headline-md">Our Vision</h3>
              <p className="text-body-lg">
                To be the global benchmark for luxury lifestyle photography, where every frame captured becomes a timeless heirloom for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="why-section">
        <div className="container">
          <div className="why-section__header reveal">
            <span className="text-label-sm" style={{ color: 'var(--color-primary)' }}>The Pixel Standard</span>
            <h2 className="text-headline-lg">Why Our Clients Trust Us</h2>
          </div>
          <div className="why-grid">
            {WHY_US.map(({ icon, title, desc }, i) => (
              <div key={i} className="why-card reveal">
                <span className="material-symbols-outlined why-card__icon">{icon}</span>
                <h4 className="text-headline-sm why-card__title">{title}</h4>
                <p className="text-body-md why-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="container">
          <div className="team-section__header reveal">
            <span className="text-label-sm" style={{ color: 'var(--color-primary)' }}>Behind the Lens</span>
            <h2 className="text-headline-lg">Meet Our Artists</h2>
          </div>
          <div className="team-grid">
            {TEAM.map(({ name, role, bio, img }, i) => (
              <div key={i} className="team-card reveal soft-shadow">
                <div className="team-card__img img-zoom">
                  <img referrerPolicy="no-referrer" src={img} alt={name} />
                </div>
                <div className="team-card__info">
                  <h3 className="text-headline-sm team-card__name">{name}</h3>
                  <span className="text-label-sm team-card__role">{role}</span>
                  <p className="text-body-md team-card__bio">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section" id="contact">
        <div className="container contact-section__grid">
          {/* Contact Info */}
          <div className="contact-info reveal">
            <h2 className="text-headline-lg" style={{ color: 'var(--color-primary)' }}>Let's Connect</h2>
            <p className="text-body-lg contact-info__desc">
              We'd love to hear about your upcoming celebration. Reach out and let's start planning how to capture your unique story.
            </p>
            <div className="contact-info__details">
              {[
                { icon: 'call', label: 'Call Us', value: '+1 (555) 234-5678', href: 'tel:+15552345678' },
                { icon: 'mail', label: 'Email', value: 'hello@pixelmemories.com', href: 'mailto:hello@pixelmemories.com' },
                { icon: 'location_on', label: 'Studio', value: '123 Atelier Way, Los Angeles, CA', href: '#' },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="contact-info__item">
                  <span className="material-symbols-outlined contact-info__icon">{icon}</span>
                  <div>
                    <span className="text-label-sm contact-info__label">{label}</span>
                    <a href={href} className="text-body-lg contact-info__val">{value}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrap reveal">
            <form className="contact-form" onSubmit={e => e.preventDefault()}>
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label className="form-label">Full Name</label>
                  <input type="text" placeholder="Your Name" className="form-input" />
                </div>
                <div className="contact-form__field">
                  <label className="form-label">Email Address</label>
                  <input type="email" placeholder="your@email.com" className="form-input" />
                </div>
                <div className="contact-form__field">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" placeholder="(555) 000-0000" className="form-input" />
                </div>
                <div className="contact-form__field">
                  <label className="form-label">Subject</label>
                  <input type="text" placeholder="Wedding, Portrait, Event..." className="form-input" />
                </div>
              </div>
              <div className="contact-form__field contact-form__field--full">
                <label className="form-label">Your Message</label>
                <textarea placeholder="Tell us more about your vision..." className="form-input" rows={5} style={{ resize: 'none', height: 'auto' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: '8px' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Instagram Preview */}
      <section className="instagram-section">
        <div className="container">
          <div className="instagram-section__header reveal">
            <div>
              <span className="text-label-sm" style={{ color: 'var(--color-primary)', display: 'block', marginBottom: 8 }}>@pixelmemories</span>
              <h2 className="text-headline-md">Follow Our Story</h2>
            </div>
            <a href="#" className="text-label-sm instagram-section__link">View Profile</a>
          </div>
          <div className="instagram-grid reveal">
            {INSTAGRAM.map((src, i) => (
              <div key={i} className="instagram-item img-zoom">
                <img referrerPolicy="no-referrer" src={src} alt={`Instagram post ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="about-cta reveal">
        <div className="container about-cta__inner">
          <h2 className="text-display-lg about-cta__title"><em>Let's Create Beautiful Memories Together</em></h2>
          <Link to="/booking" className="btn-primary" style={{ background: 'white', color: 'var(--color-primary)', padding: '16px 48px' }}>
            Capture Now
          </Link>
        </div>
      </section>
    </div>
  );
}
