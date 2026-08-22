import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <Link to="/" className="site-footer__logo">
          <span className="site-footer__logo-icon">🌿</span>
          <span>SaverFwd</span>
        </Link>

        <nav className="site-footer__links">
          <Link to="/about">About</Link>
          <span className="site-footer__dot">·</span>
          <Link to="/contact">Contact</Link>
          <span className="site-footer__dot">·</span>
          <Link to="/privacy">Privacy</Link>
          <span className="site-footer__dot">·</span>
          <Link to="/terms">Terms</Link>
        </nav>

        <p className="site-footer__copy">© {new Date().getFullYear()} SaverFwd</p>
      </div>
    </footer>
  );
}
