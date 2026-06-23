import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import useReveal from '../hooks/useReveal';
import Hero from '../components/Hero';
import Services from '../components/Services';
import CTA from '../components/CTA';
import TestimonialShuffle from '../components/TestimonialShuffle';
import InteractiveGallery from '../components/InteractiveGallery';
import CircularPortfolio from '../components/CircularPortfolio';

const PORTFOLIO_HIGHLIGHTS = [
  {
    title: "The Golden Hour",
    category: "Maternity",
    description: "Capturing the serene beauty of motherhood bathed in natural sunset light. Every frame tells a story of anticipation and unconditional love.",
    src: "/maternity.jpg"
  },
  {
    title: "A Timeless Vow",
    category: "Wedding",
    description: "From quiet glances to grand celebrations, we document your most treasured day with an editorial, unobtrusive approach.",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
  },
  {
    title: "First Milestones",
    category: "Birthday",
    description: "Preserving the fleeting magic of childhood. We transform simple celebrations into stunning, magazine-quality portraits.",
    src: "/birthday.png"
  },
  {
    title: "The Next Chapter",
    category: "Graduation",
    description: "Honoring academic achievements and bright futures with vibrant, professional, and personality-driven portraits.",
    src: "/milestone.jpg"
  }
];

const GALLERY = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5QVTjugzSOWUYLeUXOszGJ_MScs3RGGDdDnyBT9Yk8Ktqy6fcmWis2NgoOU0uCpP02t9KPDzTbBoituE6fkD13d85Vq9PABQkdcOra1lr1LA-uHIulnKRQiT2p1RIAMp2le71Ax-eRI0Rl1d7D_j_8ygmZ5NQ0wY6P45wJ78jrFjpaUnJcBc0rphxKRpHCfxKz-ALvPNVvSrXE3BKTV9SvhQOdqTawq1F1VpZewwSv6mgWa9nhhrzAjnEaLTYffmfOoknLk7jjGE',
    tag: 'Wedding', alt: 'Wedding portrait',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXUa81LqyG6kcXtbpBD46M8shTj5XLyyvqtPRiVGR-CPCK4j7nr6Z9dMEppF3jZdTdY6j74CjhDlCLCRIb8ZMR0ymD9EG6dxY0bXIPQMKVZTwahTwQTk-c7CoRgsc8TFPZ4B5l5v1b8Xj7GZ91JSL-Ka4qveKpRrz9-KSCBCmKMV-gJt8W4ZpuJMwPeLn1D0xWMfFWXXwpI4W08g7jzNac0B1Pdo7pP5yVCH0k9NBbhBjaoac1JCPq5ACNfYqPWELK-8prW833F-E',
    tag: 'Maternity', alt: 'Maternity session',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATjn9cmZuuoX3v_bmbGupGOEFcjHDTnEU-uHxNS2kbUEUkWr08rAIXMqT4hHwNMkDSErvvzvIl5eFAcSqPuYn1cBoqlAdoBCIVvdNcXnbMmvfuRrr1qfbX-1qhs-LQHdNPBn84q6pryf0BIB1WCUlsNtyLQ9iBjDtNQC4JYXbrtBUoRxSCEMqibViTdKlWNTwYfACTPyQlBqGCxTpxEgSVAo8SeXixrZfpSA0dlxdr1wiS9mYuWMTpWnOVflH5Z08jWrrZ75YfDas',
    tag: 'Celebration', alt: 'Event decor',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgt0AlzwqWyDIE-rgYdIrptEW5EEw2cNajB5_KgqkhnDaElBLfXtbsK6X64Vfk8WS1a2vDcsbPWigyXO7iWnxUwKYWfWOasuA9QiQxM3XQE8KM0e9xayRFI18GURXpC2fyP0YHpaza0jFDi_bEw-DkbmNFvzRqQ1zexWDsih0HmLYLyEkfLUMDoK1qX9wYL8aRH5Urxi6R3Pgs7ObzlceqY5Z-rdkTKgRdsbYCvwBMsBoS8rICGRpyc1cPJRm3sIhNuxO-xt4KH40',
    tag: 'Details', alt: 'Wedding cake',
  },
  {
    src: '/milestone.jpg',
    tag: 'Milestone', alt: 'Graduation',
  },
  {
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2000&auto=format&fit=crop',
    tag: 'Portrait', alt: 'Portrait session',
  },
];

const TESTIMONIALS = [
  {
    quote: '"The team at Pixel Memories completely understood our vision. The photos feel like stills from a classic film. Absolutely breathless results."',
    name: 'Eleanor & James',
    session: 'Wedding Collection',
    image: '',
    featured: false,
  },
  {
    quote: '"A truly luxury experience from start to finish. They captured my maternity journey with such grace and softness. I will cherish these forever."',
    name: 'Sophia M.',
    session: 'Maternity Session',
    image: '',
    featured: true,
  },
  {
    quote: '"They turned our daughter\'s 1st birthday into an editorial spread. The subtle lighting and composition are simply unmatched in the industry."',
    name: 'The Harrison Family',
    session: 'Birthday Event',
    image: '',
    featured: false,
  },
];

export default function Home() {
  const pageRef = useReveal();

  useEffect(() => {
    document.title = 'Pixel Memories — Luxury Photography Studio';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page-wrapper home bg-surface text-on-surface" ref={pageRef}>
      {/* Hero Section */}
      <Hero />

      {/* Featured Services */}
      <Services />

      {/* Photography Showcase */}
      <section className="py-section-gap bg-surface">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16 reveal">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-[0.2em]">Capturing Moments That Last Forever</span>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mt-4 mb-4">Portfolio Highlights</h2>
          </div>
          <div className="reveal">
            <CircularPortfolio highlights={PORTFOLIO_HIGHLIGHTS} autoplay={true} />
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-section-gap bg-surface" id="gallery">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16 reveal">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">Selected Works</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">A glimpse into our visual poetry. Every frame is treated as a piece of fine art, meticulously crafted for eternity.</p>
          </div>
          <div className="reveal">
            <InteractiveGallery images={GALLERY} />
          </div>
          <div className="mt-16 text-center reveal">
            <Link to="/gallery" className="inline-block border-b border-primary text-primary font-label-sm text-label-sm uppercase tracking-[0.2em] pb-2 hover:text-primary-container hover:border-primary-container transition-colors duration-300">
                View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-20 reveal">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">Client Love</h2>
            <div className="w-12 h-px bg-primary-container mx-auto"></div>
          </div>
          <div className="reveal">
            <TestimonialShuffle testimonials={TESTIMONIALS} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />
    </main>
  );
}
