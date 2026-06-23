import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-section-gap bg-secondary-container/30 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-inverse-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10 flex flex-col items-center reveal">
        <span className="material-symbols-outlined text-5xl text-primary mb-8">camera_enhance</span>
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface mb-6">Let's Create Magic</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">Our calendar is currently open for the upcoming season. Reach out to discuss your vision, reserve your date, and begin curating your bespoke photographic experience.</p>
        <Link to="/booking" className="px-12 py-5 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 rounded-DEFAULT shadow-[0_20px_40px_rgba(200,142,167,0.2)] hover:shadow-[0_20px_40px_rgba(200,142,167,0.4)] hover:-translate-y-1">
            Book Your Consultation
        </Link>
      </div>
    </section>
  );
}
