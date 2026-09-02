import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Leaf, ArrowRight, Lock, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { useToast } from '../../context/ToastContext';
import { validateLogin, validateRegister } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import './AuthModal.css';

export default function AuthModal() {
  const { isOpen, defaultTab, closeAuthModal } = useAuthModal();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const overlayRef = useRef(null);

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Login state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Sync tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setForgotSent(false);
      setForgotEmail('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, defaultTab]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeAuthModal]);

  // ── Login ──
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginErrors[name]) setLoginErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(loginData);
    if (Object.keys(validationErrors).length > 0) {
      setLoginErrors(validationErrors);
      return;
    }
    setLoginLoading(true);
    try {
      await login({ username: loginData.email, password: loginData.password });
      toast.success('Welcome back!');
      closeAuthModal();
    } catch (err) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Register ──
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (registerErrors[name]) setRegisterErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(registerData);
    if (Object.keys(validationErrors).length > 0) {
      setRegisterErrors(validationErrors);
      return;
    }
    setRegisterLoading(true);
    try {
      const { confirmPassword: _, ...submitData } = registerData;
      submitData.phoneNumber = submitData.phoneNumber.replace(/\D/g, '');
      await register(submitData);
      toast.success('Account created! Welcome to SaverFwd.');
      closeAuthModal();
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="auth-modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) closeAuthModal(); }}
    >
      <div className="auth-modal" role="dialog" aria-modal="true">
        {/* Close button */}
        <button className="auth-modal__close" onClick={closeAuthModal} aria-label="Close">
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="auth-modal__logo">
          <span className="auth-modal__logo-icon"><Leaf size={22} /></span>
          SaverFwd
        </div>

        {/* Tabs — hidden in forgot password view */}
        {activeTab !== 'forgot' && (
          <div className="auth-modal__tabs">
            <button
              className={`auth-modal__tab ${activeTab === 'login' ? 'auth-modal__tab--active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Log In
            </button>
            <button
              className={`auth-modal__tab ${activeTab === 'register' ? 'auth-modal__tab--active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* ── Login Form ── */}
        {activeTab === 'login' && (
          <form key="login" onSubmit={handleLoginSubmit} className="auth-modal__form auth-modal__view">
            <div className="auth-modal__welcome">
              <h2>Welcome back</h2>
              <p>Sign in to continue to SaverFwd</p>
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={handleLoginChange}
              error={loginErrors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleLoginChange}
              error={loginErrors.password}
              required
              autoComplete="current-password"
            />

            <div className="auth-modal__row">
              <button type="button" className="auth-modal__link" onClick={() => setActiveTab('forgot')}>
                <KeyRound size={14} />
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth loading={loginLoading} size="lg">
              Log In
              <ArrowRight size={18} />
            </Button>
          </form>
        )}

        {/* ── Register Form ── */}
        {activeTab === 'register' && (
          <form key="register" onSubmit={handleRegisterSubmit} className="auth-modal__form auth-modal__view">
            <div className="auth-modal__welcome">
              <h2>Create your account</h2>
              <p>Join the community reducing food waste</p>
            </div>

            <Input
              label="Full name"
              name="fullName"
              placeholder="Your full name"
              value={registerData.fullName}
              onChange={handleRegisterChange}
              error={registerErrors.fullName}
              required
              autoComplete="name"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={registerData.email}
              onChange={handleRegisterChange}
              error={registerErrors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Phone number"
              name="phoneNumber"
              type="tel"
              placeholder="9876543210"
              value={registerData.phoneNumber}
              onChange={handleRegisterChange}
              error={registerErrors.phoneNumber}
              required
              autoComplete="tel"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={registerData.password}
              onChange={handleRegisterChange}
              error={registerErrors.password}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              error={registerErrors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <p className="auth-modal__terms">
              By creating an account, you agree to our{' '}
              <Link to="/terms" onClick={closeAuthModal}>Terms of Service</Link> and{' '}
              <Link to="/privacy" onClick={closeAuthModal}>Privacy Policy</Link>.
            </p>

            <Button type="submit" fullWidth loading={registerLoading} size="lg">
              Create Account
              <ArrowRight size={18} />
            </Button>
          </form>
        )}

        {/* ── Forgot Password ── */}
        {activeTab === 'forgot' && (
          <div key="forgot" className="auth-modal__form auth-modal__view">
            <div className="auth-modal__welcome">
              <div className="auth-modal__icon-circle">
                <Lock size={24} />
              </div>
              <h2>Reset your password</h2>
              <p>Enter your email and we'll send you a reset link</p>
            </div>

            {!forgotSent ? (
              <>
                <Input
                  label="Email"
                  name="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  autoComplete="email"
                />

                <Button
                  fullWidth
                  size="lg"
                  loading={forgotLoading}
                  onClick={async () => {
                    if (!forgotEmail) return;
                    setForgotLoading(true);
                    // Simulate API call
                    await new Promise((r) => setTimeout(r, 1200));
                    setForgotSent(true);
                    setForgotLoading(false);
                  }}
                >
                  Send Reset Link
                  <Mail size={18} />
                </Button>
              </>
            ) : (
              <div className="auth-modal__success">
                <div className="auth-modal__success-icon">✓</div>
                <p>
                  If an account exists with <strong>{forgotEmail}</strong>, you'll receive a
                  password reset link shortly.
                </p>
              </div>
            )}

            <button className="auth-modal__back" onClick={() => setActiveTab('login')}>
              <ArrowLeft size={16} />
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
