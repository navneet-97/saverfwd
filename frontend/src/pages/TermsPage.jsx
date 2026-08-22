import './InfoPage.css';

export default function TermsPage() {
  return (
    <div className="info-page">
      <div className="container">
      <section className="info-page__hero">
        <span className="landing__section-tag">Legal</span>
        <h1>Terms of Service</h1>
        <p>The rules and guidelines for using SaverFwd.</p>
      </section>

      <section className="info-page__content">
        <div className="info-page__text">
          <div className="info-page__section">
            <h3>Acceptance of Terms</h3>
            <p>By creating an account or using SaverFwd, you agree to these Terms of Service. If you do not agree, please do not use the platform.</p>
          </div>

          <div className="info-page__section">
            <h3>Using SaverFwd</h3>
            <ul>
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for the accuracy of your food listings</li>
              <li>You must comply with local food safety regulations</li>
              <li>You agree to treat other users with respect</li>
            </ul>
          </div>

          <div className="info-page__section">
            <h3>Food Safety Disclaimer</h3>
            <p>SaverFwd is a platform that connects food donors with recipients. We are not responsible for the quality, safety, or condition of food shared through the platform. Users share food at their own risk.</p>
          </div>

          <div className="info-page__section">
            <h3>Account Termination</h3>
            <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.</p>
          </div>

          <div className="info-page__section">
            <h3>Contact</h3>
            <p>For questions about these Terms, contact us at legal@saverfwd.com.</p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
