import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Package,
  ShoppingBag,
  User,
  Plus,
  Bell,
  Star,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import './Header.css';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/browse', label: 'Browse', icon: Search },
  { to: '/my-listings', label: 'My Listings', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
];

const BOTTOM_NAV = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/browse', label: 'Browse', icon: Search },
  { to: '/create-listing', label: 'List', icon: Plus, isAction: true },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { openAuthModal } = useAuthModal();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close the profile dropdown and mobile menu when the user logs out,
  // so they don't reappear already-open after the next login.
  useEffect(() => {
    if (!user) {
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Public header (not logged in)
  if (!user) {
    return (
      <header className="header">
        <div className="header__inner">
          <Link to="/" className="header__logo">
            <span className="header__logo-icon">🌿</span>
            SaverFwd
          </Link>
          <div className="header__public-links">
            <button className="btn btn--ghost btn--sm" onClick={() => openAuthModal('login')}>Log In</button>
            <button className="btn btn--primary btn--sm" onClick={() => openAuthModal('register')}>Get Started</button>
          </div>
        </div>
      </header>
    );
  }

  // Authenticated header
  return (
    <>
      <header className="header">
        <div className="header__inner">
          <Link to="/dashboard" className="header__logo">
            <span className="header__logo-icon">🌿</span>
            SaverFwd
          </Link>

          <nav className="header__nav">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`header__nav-link ${isActive(to) ? 'header__nav-link--active' : ''}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <Link to="/create-listing" className="header__list-btn">
              <Plus size={18} />
              List Food
            </Link>

            <Link to="/notifications" className="header__icon-btn">
              <Bell size={20} />
            </Link>

            <div className="header__user" ref={dropdownRef}>
              <button
                className="header__avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="" />
                ) : (
                  <span>{user?.fullName?.charAt(0) || 'U'}</span>
                )}
              </button>

              {dropdownOpen && (
                <div className="header__dropdown">
                  <div className="header__dropdown-user">
                    <span className="header__dropdown-name">{user?.fullName}</span>
                    <span className="header__dropdown-email">{user?.email}</span>
                  </div>
                  <div className="header__dropdown-divider" />
                  <Link to="/profile" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={16} />
                    Profile
                  </Link>
                  <Link to="/notifications" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Bell size={16} />
                    Notifications
                  </Link>
                  <Link to="/ratings" className="header__dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Star size={16} />
                    My Ratings
                  </Link>
                  <button className="header__dropdown-item header__dropdown-item--danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              className="header__mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        {BOTTOM_NAV.map(({ to, label, icon: Icon, isAction }) => (
          <Link
            key={to}
            to={to}
            className={`bottom-nav__item ${isAction ? 'bottom-nav__item--action' : ''} ${isActive(to) ? 'bottom-nav__item--active' : ''}`}
          >
            <Icon size={isAction ? 24 : 22} strokeWidth={isActive(to) || isAction ? 2.5 : 1.8} />
            <span className="bottom-nav__label">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger menu (overlay) */}
      {mobileMenuOpen && (
        <div className="header__mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="header__mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="header__mobile-user">
              <div className="header__avatar header__avatar--lg">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="header__mobile-name">{user?.fullName}</div>
                <div className="header__mobile-email">{user?.email}</div>
              </div>
            </div>
            <div className="header__mobile-divider" />
            <nav className="header__mobile-nav">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`header__mobile-link ${isActive(to) ? 'header__mobile-link--active' : ''}`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}
              <Link to="/notifications" className="header__mobile-link">
                <Bell size={20} />
                Notifications
              </Link>
              <Link to="/ratings" className="header__mobile-link">
                <Star size={20} />
                My Ratings
              </Link>
              <button className="header__mobile-link header__mobile-link--danger" onClick={handleLogout}>
                <LogOut size={20} />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
