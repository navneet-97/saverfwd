import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateLogin } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Backend login expects { username, password }
      // We send email as the username field
      await login({ username: formData.email, password: formData.password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.message || 'Invalid email or password.';
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
            Give Extra Food<br />a Second Chance
          </h2>
          <p className="auth-visual__text">
            Join thousands of people reducing food waste in their communities every day.
          </p>

          <div className="auth-visual__flow">
            <div className="auth-visual__flow-item">
              <div className="auth-visual__flow-icon">🍽️</div>
              <div>
                <div className="auth-visual__flow-label">List surplus food</div>
                <div className="auth-visual__flow-desc">Share what you can't use</div>
              </div>
            </div>
            <div className="auth-visual__flow-item">
              <div className="auth-visual__flow-icon">🤝</div>
              <div>
                <div className="auth-visual__flow-label">Connect locally</div>
                <div className="auth-visual__flow-desc">Match with people nearby</div>
              </div>
            </div>
            <div className="auth-visual__flow-item">
              <div className="auth-visual__flow-icon">🌱</div>
              <div>
                <div className="auth-visual__flow-label">Reduce waste</div>
                <div className="auth-visual__flow-desc">Every meal makes a difference</div>
              </div>
            </div>
          </div>

          <div className="auth-visual__stats">
            <div className="auth-visual__stat">
              <span className="auth-visual__stat-value">12K+</span>
              <span className="auth-visual__stat-label">Meals Saved</span>
            </div>
            <div className="auth-visual__stat">
              <span className="auth-visual__stat-value">3.5K</span>
              <span className="auth-visual__stat-label">Users</span>
            </div>
            <div className="auth-visual__stat">
              <span className="auth-visual__stat-value">48K</span>
              <span className="auth-visual__stat-label">kg Rescued</span>
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
            <h1>Welcome Back</h1>
            <p>Sign in to continue reducing food waste</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              Log In
            </Button>
          </form>

          <div className="auth-card__footer">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
