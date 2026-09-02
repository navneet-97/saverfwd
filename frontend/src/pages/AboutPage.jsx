import { Link } from 'react-router-dom';
import { Leaf, Users, Heart, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthModal } from '../context/AuthModalContext';
import './InfoPage.css';

export default function AboutPage() {
  const { openAuthModal } = useAuthModal();

  return (
    <div className="info-page">
      <div className="container">
        <section className="info-page__hero">
          <div className="info-page__hero-badge">
            <Sparkles size={14} />
            About Us
          </div>
          <h1>Our Mission</h1>
          <p>We believe no good food should go to waste while people go hungry.</p>
        </section>

        <section className="info-page__content">
          <div className="info-page__container">
            <div className="info-page__section">
              <div className="info-page__section-icon info-page__section-icon--green">
                <Leaf size={24} />
              </div>
              <h3>What is SaverFwd?</h3>
              <p>
                SaverFwd is a food waste reduction platform that connects people and businesses
                who have excess food with people or organizations who can use it. Whether it's
                surplus from an event, unsold inventory, or simply more than you need — we help
                it find a new home.
              </p>
            </div>

            <div className="info-page__section">
              <div className="info-page__section-icon info-page__section-icon--purple">
                <Heart size={24} />
              </div>
              <h3>Why We Built This</h3>
              <p>
                Every year, millions of tonnes of food are wasted while communities struggle with
                food insecurity. SaverFwd was built to bridge this gap — making it effortless for
                anyone to share food and for anyone to find it.
              </p>
            </div>

            <div className="info-page__values">
              <div className="info-page__value-card">
                <div className="info-page__value-icon info-page__section-icon--green">
                  <Leaf size={28} />
                </div>
                <h3>Sustainability</h3>
                <p>Every meal saved is a step toward a more sustainable planet.</p>
              </div>
              <div className="info-page__value-card">
                <div className="info-page__value-icon info-page__section-icon--blue">
                  <Users size={28} />
                </div>
                <h3>Community</h3>
                <p>Building connections between neighbors, businesses, and organizations.</p>
              </div>
              <div className="info-page__value-card">
                <div className="info-page__value-icon info-page__section-icon--purple">
                  <Heart size={28} />
                </div>
                <h3>Compassion</h3>
                <p>Because sharing food is one of the oldest acts of kindness.</p>
              </div>
              <div className="info-page__value-card">
                <div className="info-page__value-icon info-page__section-icon--amber">
                  <Globe size={28} />
                </div>
                <h3>Impact</h3>
                <p>Tracking real results — food listed, food saved, waste prevented.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="info-page__cta">
          <div className="info-page__container">
            <h2>Join Us</h2>
            <p>Start making a difference in your community today.</p>
            <div className="info-page__cta-actions">
              <button className="btn btn--cta-primary btn--lg" onClick={() => openAuthModal('register')}>
                Create Free Account
                <ArrowRight size={18} />
              </button>
              <Link to="/browse" className="btn btn--cta-ghost btn--lg">
                Browse Food
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}