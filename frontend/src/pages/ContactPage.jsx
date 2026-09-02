import { Mail, MapPin, Clock, MessageCircle, ArrowRight, Headphones } from 'lucide-react';
import './InfoPage.css';

export default function ContactPage() {
  return (
    <div className="info-page">
      <div className="container">
        <section className="info-page__hero">
          <div className="info-page__hero-badge">
            <Headphones size={14} />
            Get in Touch
          </div>
          <h1>Contact Us</h1>
          <p>Have a question, suggestion, or just want to say hello?</p>
        </section>

        <section className="info-page__content">
          <div className="info-page__container">
            <div className="info-page__contact-grid">
              <div className="info-page__contact-card">
                <div className="info-page__contact-icon info-page__section-icon--green">
                  <Mail size={28} />
                </div>
                <h3>Email Us</h3>
                <p>hello@saverfwd.com</p>
              </div>
              <div className="info-page__contact-card">
                <div className="info-page__contact-icon info-page__section-icon--purple">
                  <MapPin size={28} />
                </div>
                <h3>Location</h3>
                <p>India</p>
              </div>
              <div className="info-page__contact-card">
                <div className="info-page__contact-icon info-page__section-icon--blue">
                  <Clock size={28} />
                </div>
                <h3>Response Time</h3>
                <p>Within 24 hours</p>
              </div>
            </div>

            <div className="info-page__info-block">
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