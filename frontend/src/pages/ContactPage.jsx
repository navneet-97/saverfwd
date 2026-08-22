import { Mail, MapPin, Clock } from 'lucide-react';
import './InfoPage.css';

export default function ContactPage() {
  return (
    <div className="info-page">
      <div className="container">
      <section className="info-page__hero">
        <span className="landing__section-tag">Get in Touch</span>
        <h1>Contact Us</h1>
        <p>Have a question, suggestion, or just want to say hello?</p>
      </section>

      <section className="info-page__content">
        <div className="info-page__text">
          <div className="info-page__values">
            <div className="info-page__value-card">
              <Mail size={24} color="var(--color-primary)" />
              <h3>Email</h3>
              <p>hello@saverfwd.com</p>
            </div>
            <div className="info-page__value-card">
              <MapPin size={24} color="#dc2626" />
              <h3>Location</h3>
              <p>India</p>
            </div>
            <div className="info-page__value-card">
              <Clock size={24} color="#2563eb" />
              <h3>Response Time</h3>
              <p>Within 24 hours</p>
            </div>
          </div>

          <div className="info-page__section" style={{ marginTop: '2.5rem' }}>
            <h3>We'd Love to Hear From You</h3>
            <p>
              Whether you're a food business looking to reduce waste, a community organization
              in need of food, or just someone who wants to make a difference — we're here to help.
              Drop us an email and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
