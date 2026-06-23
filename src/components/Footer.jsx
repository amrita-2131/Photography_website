import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="w-full pt-section-gap pb-12 bg-surface-container-low">
      <div className="max-w-container-max-width mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop border-b border-outline-variant/30 pb-16 mb-8">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1 flex flex-col items-start">
          <Link to="/" className="font-headline-md text-headline-md text-primary mb-6 tracking-tight">
            Pixel Memories
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mb-8">
            Preserving life's most exquisite moments through an editorial lens.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:bg-primary hover:text-on-primary hover:border-primary transition-colors duration-300">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </a>
            <a href="mailto:hello@pixelmemories.com" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-secondary hover:bg-primary hover:text-on-primary hover:border-primary transition-colors duration-300">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface mb-2">Explore</h4>
          <Link to="/" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100">Home</Link>
          <Link to="/services" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100">Services</Link>
          <Link to="/gallery" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100">Portfolio</Link>
          <Link to="/about" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100">About the Artist</Link>
        </div>

        {/* Information Column */}
        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface mb-2">Information</h4>
          <Link to="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100">Privacy Policy</Link>
          <Link to="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100">Terms of Service</Link>
          <Link to="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100">Studio Directions</Link>
          <Link to="/about" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200 opacity-80 hover:opacity-100">FAQ</Link>
        </div>

        {/* Contact Column */}
        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface mb-2">Studio</h4>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-80">
            123 Luxury Lane<br />Art District, NY 10001
          </p>
          <a href="mailto:hello@pixelmemories.com" className="font-body-md text-body-md text-primary mt-2 hover:underline opacity-80 hover:opacity-100">
            hello@pixelmemories.com
          </a>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-80">+1 (555) 123-4567</p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body-md text-body-md text-on-surface-variant opacity-60">
          © {new Date().getFullYear()} Pixel Memories. All rights reserved.
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant opacity-60 text-sm">
          Designed with elegance.
        </p>
      </div>
    </footer>
  );
}
