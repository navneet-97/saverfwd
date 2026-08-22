import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Package,
  ShoppingBag,
  MessageSquare,
  User,
  Plus,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/browse', label: 'Browse Food', icon: Search },
  { to: '/my-listings', label: 'My Listings', icon: Package },
  { to: '/orders', label: 'My Orders', icon: ShoppingBag },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    navigate('/login');
  };

  return (
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
              className={`header__nav-link ${location.pathname === to ? 'header__nav-link--active' : ''}`}
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

      {mobileMenuOpen && (
        <div className="header__mobile-menu">
          <nav className="header__mobile-nav">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`header__mobile-link ${location.pathname === to ? 'header__mobile-link--active' : ''}`}
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
            <Link to="/create-listing" className="header__mobile-link header__mobile-link--primary">
              <Plus size={20} />
              List Food
            </Link>
            <Link to="/notifications" className="header__mobile-link">
              <Bell size={20} />
              Notifications
            </Link>
            <button className="header__mobile-link header__mobile-link--danger" onClick={handleLogout}>
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
