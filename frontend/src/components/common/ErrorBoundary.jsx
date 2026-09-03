import { Component } from 'react';
import './ErrorBoundary.css';

// Top-level error boundary: if any component throws during render, show a
// friendly recovery screen instead of a blank/crashed page. Errors are logged
// to the console with details; the UI stays generic.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <span className="error-boundary__icon" role="img" aria-label="">🌿</span>
            <h1 className="error-boundary__title">Something went wrong</h1>
            <p className="error-boundary__text">
              An unexpected error occurred. Please reload the page to continue.
            </p>
            <div className="error-boundary__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => { window.location.href = '/'; }}
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
