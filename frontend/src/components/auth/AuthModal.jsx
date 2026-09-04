import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Leaf, ArrowRight, Lock, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { useToast } from '../../context/ToastContext';
import authApi from '../../api/authApi';
import { validateEmail, validateLogin, validateRegister, isPasswordValid } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import PasswordField from './PasswordField';
import './AuthModal.css';

// Extract a readable backend message from an axios rejection.
// Backend errors arrive as ErrorResponse: { success, message, error, ... }
function getApiErrorMessage(err, fallback) {
  const data = err?.response?.data;
  const detail = data && (typeof data.error === 'string' ? data.error : data.message);
  if (typeof detail === 'string' && detail.trim()) return detail;
  return err?.message || fallback;
}

// Raw backend messages can leak security-relevant details (e.g. whether an
// account exists for a given email), so production toasts show generic text
// and the real error only lands in the console during development.
const devLogAuthError = (err, fallback) => {
  if (import.meta.env.DEV) {
    console.debug('[auth error]', getApiErrorMessage(err, fallback));
  }
};

export default function AuthModal() {
  const { isOpen, defaultTab, closeAuthModal } = useAuthModal();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerPasswordTouched, setRegisterPasswordTouched] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotView, setForgotView] = useState('email'); // 'email' | 'reset'
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetData, setResetData] = useState({ otp: '', password: '' });
  const [resetErrors, setResetErrors] = useState({});
  const [resetLoading, setResetLoading] = useState(false);
  const [resetPasswordTouched, setResetPasswordTouched] = useState(false);

  // Error shown under a password field. A missing password only complains once
  // the field has been touched; a too-weak password turns the input red instead
  // (PasswordField) and the submit button stays disabled until it's valid.
  const passwordError = useCallback((password, showRequired) => {
    if (!password) return showRequired ? 'Password is required' : '';
    return '';
  }, []);

  const clearForgotState = useCallback(() => {
    setForgotEmail('');
    setForgotView('email');
    setForgotEmailError('');
    setForgotLoading(false);
    setResetData({ otp: '', password: '' });
    setResetErrors({});
    setResetLoading(false);
    setResetPasswordTouched(false);
  }, []);

  // Clear all form fields, errors, and forgot-password state
  const clearForms = useCallback(() => {
    setLoginData({ email: '', password: '' });
    setRegisterData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
    });
    setLoginErrors({});
    setRegisterErrors({});
    setRegisterPasswordTouched(false);
    clearForgotState();
  }, [clearForgotState]);

  // Reset form state and sync tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      clearForms();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, defaultTab, clearForms]);

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
      await login({ email: loginData.email, password: loginData.password });
      clearForms();
      closeAuthModal();
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      devLogAuthError(err, 'Invalid email or password.');
      // Same message for unknown email vs wrong password — never reveal which.
      toast.error('Invalid email or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Register ──
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setRegisterErrors((prev) => ({
        ...prev,
        password: passwordError(value, registerPasswordTouched),
      }));
    } else if (registerErrors[name]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterPasswordChange = (value) => {
    setRegisterData((prev) => ({ ...prev, password: value }));
    setRegisterErrors((prev) => ({
      ...prev,
      password: passwordError(value, registerPasswordTouched),
    }));
  };

  const handleRegisterPasswordBlur = () => {
    setRegisterPasswordTouched(true);
    setRegisterErrors((prev) => ({
      ...prev,
      password: passwordError(registerData.password, true),
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(registerData);
    if (validationErrors.password) setRegisterPasswordTouched(true);
    if (Object.keys(validationErrors).length > 0) {
      setRegisterErrors(validationErrors);
      return;
    }
    setRegisterLoading(true);
    try {
      const submitData = {
        ...registerData,
        phoneNumber: registerData.phoneNumber.replace(/\D/g, ''),
      };
      await register(submitData);
      clearForms();
      closeAuthModal();
      toast.success('Account created! Welcome to SaverFwd.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      devLogAuthError(err, 'Registration failed. Please try again.');
      toast.error(
        err?.response?.status === 409
          ? 'An account with this email already exists. Please log in.'
          : 'Registration failed. Please try again.'
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  // ── Forgot password ──
  const requestResetCode = async () => {
    const email = forgotEmail.trim();
    const emailError = validateEmail(email);
    if (emailError) {
      setForgotEmailError(emailError);
      return;
    }
    setForgotEmailError('');
    setForgotLoading(true);
    try {
      await authApi.forgotPassword(email);
      // On a resend the view doesn't change, so tell the user a fresh code went out.
      if (forgotView === 'reset') {
        toast.success(`A new reset code was sent to ${email}.`);
      }
      setForgotView('reset');
    } catch (err) {
      devLogAuthError(err, 'Could not send reset code.');
      // Neutral message: don't reveal whether the email is registered.
      toast.info('If an account exists with that email, a reset code will be sent.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setResetErrors((prev) => ({
        ...prev,
        password: passwordError(value, resetPasswordTouched),
      }));
    } else if (resetErrors[name]) {
      setResetErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleResetPasswordChange = (value) => {
    setResetData((prev) => ({ ...prev, password: value }));
    setResetErrors((prev) => ({
      ...prev,
      password: passwordError(value, resetPasswordTouched),
    }));
  };

  const handleResetPasswordBlur = () => {
    setResetPasswordTouched(true);
    setResetErrors((prev) => ({
      ...prev,
      password: passwordError(resetData.password, true),
    }));
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    const otp = resetData.otp.trim();
    if (!/^\d{6}$/.test(otp)) errors.otp = 'Enter the 6-digit code';
    if (!resetData.password) {
      errors.password = 'Password is required';
      setResetPasswordTouched(true);
    }
    if (Object.keys(errors).length > 0) {
      setResetErrors(errors);
      return;
    }
    setResetLoading(true);
    try {
      await authApi.resetPassword({ otp, password: resetData.password });
      const email = forgotEmail.trim();
      toast.success('Password reset successfully! Please log in.');
      clearForgotState();
      setActiveTab('login');
      setLoginData((prev) => ({ ...prev, email }));
    } catch (err) {
      devLogAuthError(err, 'Could not reset password.');
      toast.error('The code is invalid or has expired. Please request a new code.');
    } finally {
      setResetLoading(false);
    }
  };

  const goBackToLogin = () => {
    clearForgotState();
    setActiveTab('login');
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

            <PasswordField
              label="Password"
              value={registerData.password}
              onChange={handleRegisterPasswordChange}
              onBlur={handleRegisterPasswordBlur}
              error={registerErrors.password}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />

            <p className="auth-modal__terms">
              By creating an account, you agree to our{' '}
              <Link to="/terms" onClick={closeAuthModal}>Terms of Service</Link> and{' '}
              <Link to="/privacy" onClick={closeAuthModal}>Privacy Policy</Link>.
            </p>

            <Button
              type="submit"
              fullWidth
              loading={registerLoading}
              size="lg"
              disabled={registerData.password !== '' && !isPasswordValid(registerData.password)}
            >
              Create Account
              <ArrowRight size={18} />
            </Button>
          </form>
        )}

        {/* ── Forgot Password ── */}
        {activeTab === 'forgot' && (
          <div key="forgot" className="auth-modal__form auth-modal__view">
            {forgotView === 'email' ? (
              <div className="auth-modal__form">
                <div className="auth-modal__welcome">
                  <div className="auth-modal__icon-circle">
                    <Lock size={24} />
                  </div>
                  <h2>Reset your password</h2>
                  <p>Enter your email and we'll send you a one-time reset code</p>
                </div>

                <Input
                  label="Email"
                  name="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    if (forgotEmailError) setForgotEmailError('');
                  }}
                  error={forgotEmailError}
                  required
                  autoComplete="email"
                />

                <Button fullWidth size="lg" loading={forgotLoading} onClick={requestResetCode}>
                  Send Reset Code
                  <Mail size={18} />
                </Button>
              </div>
            ) : (
              <form className="auth-modal__form" onSubmit={handleResetSubmit} noValidate>
                <div className="auth-modal__welcome">
                  <div className="auth-modal__icon-circle">
                    <Lock size={24} />
                  </div>
                  <h2>Set a new password</h2>
                  <p>
                    A 6-digit code was sent to <strong>{forgotEmail}</strong>
                  </p>
                </div>

                <Input
                  label="6-digit code"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  maxLength={6}
                  value={resetData.otp}
                  onChange={handleResetChange}
                  error={resetErrors.otp}
                  required
                  autoComplete="one-time-code"
                />

                <PasswordField
                  label="New password"
                  value={resetData.password}
                  onChange={handleResetPasswordChange}
                  onBlur={handleResetPasswordBlur}
                  error={resetErrors.password}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={resetLoading}
                  size="lg"
                  disabled={resetData.password !== '' && !isPasswordValid(resetData.password)}
                >
                  Reset Password
                  <ArrowRight size={18} />
                </Button>

                <button
                  type="button"
                  className="auth-modal__link auth-modal__resend"
                  disabled={forgotLoading}
                  onClick={requestResetCode}
                >
                  <Mail size={14} />
                  Didn't get the code? Resend
                </button>
              </form>
            )}

            {forgotView === 'email' && (
              <button className="auth-modal__back" onClick={goBackToLogin}>
                <ArrowLeft size={16} />
                Back to login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
