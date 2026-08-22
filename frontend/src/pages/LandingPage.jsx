import { Link } from 'react-router-dom';
import { ArrowRight, Apple, HandHeart, Users, Leaf, TrendingDown, Heart } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing__nav">
        <div className="container landing__nav-inner">
          <Link to="/" className="landing__logo">
            <span className="landing__logo-icon">🌿</span>
            SaverFwd
          </Link>
          <div className="landing__nav-links">
            <Link to="/login" className="btn btn--ghost btn--sm">Log In</Link>
            <Link to="/register" className="btn btn--primary btn--sm">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-bg">
          <div className="landing__hero-shape landing__hero-shape--1" />
          <div className="landing__hero-shape landing__hero-shape--2" />
          <div className="landing__hero-shape landing__hero-shape--3" />
        </div>
        <div className="container landing__hero-inner">
          <div className="landing__hero-badge">
            <Leaf size={14} />
            Fighting food waste together
          </div>
          <h1 className="landing__hero-title">
            Give Extra Food<br />
            <span className="landing__hero-highlight">a Second Chance.</span>
          </h1>
          <p className="landing__hero-text">
            Connect with people and organizations who can use your excess food
            instead of letting it go to waste. Simple, fast, and community-driven.
          </p>
          <div className="landing__hero-actions">
            <Link to="/browse" className="btn btn--primary btn--lg">
              Browse Food
              <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="btn btn--secondary btn--lg">
              List Food Free
            </Link>
          </div>
          <div className="landing__hero-social-proof">
            <div className="landing__hero-avatars">
              <div className="landing__hero-avatar" style={{ background: '#fde68a', color: '#92400e' }}>N</div>
              <div className="landing__hero-avatar" style={{ background: '#bbf7d0', color: '#166534' }}>A</div>
              <div className="landing__hero-avatar" style={{ background: '#bfdbfe', color: '#1e40af' }}>R</div>
              <div className="landing__hero-avatar" style={{ background: '#fbcfe8', color: '#9d174d' }}>S</div>
              <div className="landing__hero-avatar" style={{ background: '#ddd6fe', color: '#5b21b6' }}>M</div>
            </div>
            <span className="landing__hero-social-text">
              Join <strong>3,500+</strong> people already saving food
            </span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="landing__stats-bar">
        <div className="container landing__stats-inner">
          <div className="landing__stat-item">
            <span className="landing__stat-number">12,400+</span>
            <span className="landing__stat-desc">Meals Saved</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat-item">
            <span className="landing__stat-number">48,000 kg</span>
            <span className="landing__stat-desc">Food Rescued</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat-item">
            <span className="listing__stat-number">92%</span>
            <span className="landing__stat-desc">Successful Pickups</span>
          </div>
          <div className="landing__stat-divider" />
          <div className="landing__stat-item">
            <span className="landing__stat-number">4.8 ★</span>
            <span className="landing__stat-desc">Average Rating</span>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="landing__concept">
        <div className="container">
          <div className="landing__concept-header">
            <span className="landing__section-tag">How It Works</span>
            <h2 className="landing__section-title">From surplus to someone's table</h2>
            <p className="landing__section-text">Three simple steps to reduce food waste in your community</p>
          </div>

          <div className="landing__concept-flow">
            <div className="landing__concept-item">
              <div className="landing__concept-number">01</div>
              <div className="landing__concept-icon landing__concept-icon--food">
                <Apple size={28} />
              </div>
              <h3>Excess Food</h3>
              <p>Someone has food they can't use — too much for an event, leftovers, or approaching expiry.</p>
            </div>

            <div className="landing__concept-arrow">
              <ArrowRight size={20} />
            </div>

            <div className="landing__concept-item">
              <div className="landing__concept-number">02</div>
              <div className="landing__concept-icon landing__concept-icon--platform">
                <HandHeart size={28} />
              </div>
              <h3>SaverFwd</h3>
              <p>List it in seconds. We match it with people nearby who can use it — for free or at a low price.</p>
            </div>

            <div className="landing__concept-arrow">
              <ArrowRight size={20} />
            </div>

            <div className="landing__concept-item">
              <div className="landing__concept-number">03</div>
              <div className="landing__concept-icon landing__concept-icon--people">
                <Users size={28} />
              </div>
              <h3>Someone Who Needs It</h3>
              <p>They claim it, pick it up, and one more meal is saved from the landfill. 🎉</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing__features">
        <div className="container">
          <div className="landing__concept-header">
            <span className="landing__section-tag">Why SaverFwd?</span>
            <h2 className="landing__section-title">Built for communities, not corporations</h2>
          </div>

          <div className="landing__features-grid">
            <div className="landing__feature-card">
              <div className="landing__feature-icon landing__feature-icon--green">
                <Heart size={22} />
              </div>
              <h3>One Account, Both Sides</h3>
              <p>List food you don't need, or claim food from others. One account does it all.</p>
            </div>
            <div className="landing__feature-card">
              <div className="landing__feature-icon landing__feature-icon--amber">
                <TrendingDown size={22} />
              </div>
              <h3>Truly Free for Donations</h3>
              <p>Donate food at no cost, or sell at reduced prices. The choice is always yours.</p>
            </div>
            <div className="landing__feature-card">
              <div className="landing__feature-icon landing__feature-icon--blue">
                <Users size={22} />
              </div>
              <h3>Community Trust</h3>
              <p>Ratings, reviews, and messaging help build trust between food sharers and receivers.</p>
            </div>
            <div className="landing__feature-card">
              <div className="landing__feature-icon landing__feature-icon--purple">
                <Leaf size={22} />
              </div>
              <h3>Real Impact</h3>
              <p>Track your personal contribution — food listed, food saved, and waste prevented.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing__cta">
        <div className="container landing__cta-inner">
          <div className="landing__cta-content">
            <h2>Ready to make a difference?</h2>
            <p>Join SaverFwd and start reducing food waste in your community today. It's free and takes less than 2 minutes.</p>
            <div className="landing__cta-actions">
              <Link to="/register" className="btn btn--primary btn--lg">
                Create Free Account
                <ArrowRight size={20} />
              </Link>
              <Link to="/browse" className="btn btn--ghost btn--lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                Browse Food First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="container landing__footer-inner">
          <div className="landing__footer-brand">
            <span className="landing__logo-icon">🌿</span>
            <span>SaverFwd</span>
          </div>
          <p className="landing__footer-text">© 2026 SaverFwd. Reducing food waste, one meal at a time.</p>
          <div className="landing__footer-links">
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
