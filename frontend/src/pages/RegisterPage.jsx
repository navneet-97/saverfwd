import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateRegister } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword: _, ...submitData } = formData;
      await register(submitData);
      toast.success('Account created! Welcome to SaverFwd.');
      navigate('/dashboard');
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      toast.error(message);
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
            Start Making a<br />Difference Today
          </h2>
          <p className="auth-visual__text">
            One account. Both list food and claim what others share. Every meal saved counts.
          </p>

          <div className="auth-visual__flow">
            <div className="auth-visual__flow-item">
              <div className="auth-visual__flow-icon">📦</div>
              <div>
                <div className="auth-visual__flow-label">List or Claim</div>
                <div className="auth-visual__flow-desc">Do both from one account</div>
              </div>
            </div>
            <div className="auth-visual__flow-item">
              <div className="auth-visual__flow-icon">⚡</div>
              <div>
                <div className="auth-visual__flow-label">Quick & Easy</div>
                <div className="auth-visual__flow-desc">List food in under a minute</div>
              </div>
            </div>
            <div className="auth-visual__flow-item">
              <div className="auth-visual__flow-icon">🌍</div>
              <div>
                <div className="auth-visual__flow-label">Community Impact</div>
                <div className="auth-visual__flow-desc">Together we save tonnes of food</div>
              </div>
            </div>
          </div>

          <div className="auth-visual__stats">
            <div className="auth-visual__stat">
              <span className="auth-visual__stat-value">100%</span>
              <span className="auth-visual__stat-label">Free to Join</span>
            </div>
            <div className="auth-visual__stat">
              <span className="auth-visual__stat-value">2 min</span>
              <span className="auth-visual__stat-label">To Sign Up</span>
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
            <h1>Create Account</h1>
            <p>Join the community reducing food waste</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
              autoComplete="name"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              required
              autoComplete="tel"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <p className="auth-form__terms">
              By creating an account, you agree to our{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>.
            </p>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Create Account
            </Button>
          </form>

          <div className="auth-card__footer">
            Already have an account?{' '}
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
