import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Analytics />
    </ErrorBoundary>
  </StrictMode>
);
