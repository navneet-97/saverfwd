import { Link } from 'react-router-dom';
import { Leaf, Users, Heart, Globe } from 'lucide-react';
import './InfoPage.css';

export default function AboutPage() {
  return (
    <div className="info-page">
      <div className="container">
      <section className="info-page__hero">
        <span className="landing__section-tag">About Us</span>
        <h1>Our Mission</h1>
        <p>We believe no good food should go to waste while people go hungry.</p>
      </section>

      <section className="info-page__content">
        <div className="info-page__text">
          <h2>What is SaverFwd?</h2>
          <p>
            SaverFwd is a food waste reduction platform that connects people and businesses
            who have excess food with people or organizations who can use it. Whether it's
            surplus from an event, unsold inventory, or simply more than you need — we help
            it find a new home.
          </p>

          <h2>Why We Built This</h2>
          <p>
            Every year, millions of tonnes of food are wasted while communities struggle with
            food insecurity. SaverFwd was built to bridge this gap — making it effortless for
            anyone to share food and for anyone to find it.
          </p>

          <div className="info-page__values">
            <div className="info-page__value-card">
              <Leaf size={24} color="var(--color-primary)" />
              <h3>Sustainability</h3>
              <p>Every meal saved is a step toward a more sustainable planet.</p>
            </div>
            <div className="info-page__value-card">
              <Users size={24} color="#2563eb" />
              <h3>Community</h3>
              <p>Building connections between neighbors, businesses, and organizations.</p>
            </div>
            <div className="info-page__value-card">
              <Heart size={24} color="#dc2626" />
              <h3>Compassion</h3>
              <p>Because sharing food is one of the oldest acts of kindness.</p>
            </div>
            <div className="info-page__value-card">
              <Globe size={24} color="#7c3aed" />
              <h3>Impact</h3>
              <p>Tracking real results — food listed, food saved, waste prevented.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="info-page__cta">
        <h2>Join Us</h2>
        <p>Start making a difference in your community today.</p>
        <div className="info-page__cta-actions">
          <Link to="/register" className="btn btn--primary btn--lg">Create Free Account</Link>
          <Link to="/browse" className="btn btn--secondary btn--lg">Browse Food</Link>
        </div>
      </section>
      </div>
    </div>
  );
}
