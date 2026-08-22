import './InfoPage.css';

export default function PrivacyPage() {
  return (
    <div className="info-page">
      <div className="container">
      <section className="info-page__hero">
        <span className="landing__section-tag">Legal</span>
        <h1>Privacy Policy</h1>
        <p>How we collect, use, and protect your information.</p>
      </section>

      <section className="info-page__content">
        <div className="info-page__text">
          <div className="info-page__section">
            <h3>Information We Collect</h3>
            <p>When you create an account, we collect your name, email address, and phone number. We also collect food listing data you choose to share, including pickup locations and descriptions.</p>
          </div>

          <div className="info-page__section">
            <h3>How We Use Your Information</h3>
            <ul>
              <li>To provide and maintain the SaverFwd platform</li>
              <li>To connect you with other users for food sharing</li>
              <li>To send you notifications about your listings and orders</li>
              <li>To improve our services and user experience</li>
            </ul>
          </div>

          <div className="info-page__section">
            <h3>Data Protection</h3>
            <p>We implement appropriate security measures to protect your personal information. Your data is encrypted in transit and at rest. We do not sell your personal information to third parties.</p>
          </div>

          <div className="info-page__section">
            <h3>Contact Us</h3>
            <p>If you have questions about this Privacy Policy, please contact us at privacy@saverfwd.com.</p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
