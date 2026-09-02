import { Link } from 'react-router-dom';
import { Heart, Leaf } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__glow" />
      <div className="container site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link to="/" className="site-footer__logo">
              <span className="site-footer__logo-icon">🌿</span>
              <span className="site-footer__logo-text">SaverFwd</span>
            </Link>
            <p className="site-footer__tagline">
              Connecting communities to reduce food waste. Share surplus food, claim what others give, and help save meals from landfill.
            </p>
            <div className="site-footer__socials">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="site-footer__social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="site-footer__social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="site-footer__social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          <div className="site-footer__nav-group">
            <div className="site-footer__col">
              <h4 className="site-footer__col-title">Explore</h4>
              <nav className="site-footer__links">
                <Link to="/browse">Browse Food</Link>
                <Link to="/create-listing">List Food</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/orders">My Orders</Link>
              </nav>
            </div>
            <div className="site-footer__col">
              <h4 className="site-footer__col-title">Company</h4>
              <nav className="site-footer__links">
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact</Link>
              </nav>
            </div>
            <div className="site-footer__col">
              <h4 className="site-footer__col-title">Legal</h4>
              <nav className="site-footer__links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="site-footer__divider" />

        <div className="site-footer__bottom">
          <p className="site-footer__copy">
            © {year} SaverFwd. All rights reserved.
          </p>
          <p className="site-footer__made-with">
            Built with <Heart className="site-footer__heart-icon" size={14} /> to fight food waste
          </p>
        </div>
      </div>
    </footer>
  );
}
