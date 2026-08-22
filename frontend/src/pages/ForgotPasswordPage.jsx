import { Link } from 'react-router-dom';
import './AuthPages.css';

export default function ForgotPasswordPage() {
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
            <p>Password reset functionality is coming soon.</p>
          </div>

          <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>
              🔒
            </div>
            <p style={{
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
              lineHeight: 'var(--line-height-relaxed)',
            }}>
              Password reset via email will be available in a future update.
              For now, please contact support if you need to reset your password.
            </p>
          </div>

          <div className="auth-card__footer">
            <Link to="/login">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
