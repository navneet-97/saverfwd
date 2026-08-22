import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import authApi from '../api/authApi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      toast.success('If an account exists with this email, a reset link has been sent.');
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Visual Panel */}
      <div className="auth-visual">
        <div className="auth-visual__content">
          <div className="auth-visual__logo">🌿</div>
          <h2 className="auth-visual__headline">
            Don't Worry,<br />We've Got You
          </h2>
          <p className="auth-visual__text">
            Reset your password and get back to making an impact in no time.
          </p>

          <div className="auth-visual__flow">
            <div className="auth-visual__flow-item">
              <div className="auth-visual__flow-icon">📧</div>
              <div>
                <div className="auth-visual__flow-label">Check your email</div>
                <div className="auth-visual__flow-desc">We'll send a reset link</div>
              </div>
            </div>
            <div className="auth-visual__flow-item">
              <div className="auth-visual__flow-icon">🔗</div>
              <div>
                <div className="auth-visual__flow-label">Click the link</div>
                <div className="auth-visual__flow-desc">Set a new password</div>
              </div>
            </div>
            <div className="auth-visual__flow-item">
              <div className="auth-visual__flow-icon">✅</div>
              <div>
                <div className="auth-visual__flow-label">You're back!</div>
                <div className="auth-visual__flow-desc">Continue reducing waste</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card__header">
            <Link to="/" className="auth-card__logo">
              <span>🌿</span> SaverFwd
            </Link>
            <h1>Reset Password</h1>
            <p>Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: 'var(--space-4)',
              }}>
                📩
              </div>
              <p style={{
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-6)',
                lineHeight: 'var(--line-height-relaxed)',
              }}>
                If an account exists with <strong style={{ color: 'var(--color-text)' }}>{email}</strong>,
                we've sent a password reset link.
              </p>
              <Link to="/login" className="btn btn--primary" style={{ textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Button type="submit" fullWidth loading={loading} size="lg">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="auth-card__footer">
            <Link to="/login">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
