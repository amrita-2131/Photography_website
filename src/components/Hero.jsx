import { Link } from 'react-router-dom';

const HERO_IMG = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          alt="Forever Yours - Luxury Wedding Photography" 
          referrerPolicy="no-referrer" 
          src={HERO_IMG} 
          className="w-full h-full object-cover transform scale-105" 
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 px-6 max-w-4xl mx-auto pt-20">
        <span className="font-label-sm text-label-sm text-primary-container uppercase tracking-[0.2em] reveal">
          Luxury Photography Studio
        </span>
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-white leading-tight reveal" style={{ transitionDelay: '100ms' }}>
            Turning Moments Into <i className="text-primary-container font-serif">Timeless</i> Memories
        </h1>
        <p className="font-body-lg text-body-lg text-white/90 max-w-2xl reveal" style={{ transitionDelay: '200ms' }}>
            Capturing weddings, maternity journeys, birthdays, ceremonies, and life’s most beautiful celebrations with an editorial, minimalist touch.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 w-full sm:w-auto reveal" style={{ transitionDelay: '300ms' }}>
            <Link to="/booking" className="w-full sm:w-auto px-10 py-4 bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary transition-colors duration-300 rounded-DEFAULT shadow-[0_20px_40px_rgba(200,142,167,0.2)] hover:shadow-[0_20px_40px_rgba(200,142,167,0.4)]">
                Capture Now
            </Link>
            <a className="w-full sm:w-auto px-10 py-4 border border-white/30 text-white font-label-sm text-label-sm uppercase tracking-widest hover:border-white hover:bg-white/10 transition-all duration-300 rounded-DEFAULT text-center" href="#gallery">
                View Gallery
            </a>
        </div>
      </div>
    </section>
  );
}
