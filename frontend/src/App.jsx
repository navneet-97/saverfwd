import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AuthModalProvider } from './context/AuthModalContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppLayout from './components/layout/AppLayout';
import ToastContainer from './components/common/Toast';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/auth/AuthModal';
import DashboardPage from './pages/DashboardPage';
import BrowseFoodPage from './pages/BrowseFoodPage';
import FoodDetailPage from './pages/FoodDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import MyListingsPage from './pages/MyListingsPage';
import OrdersPage from './pages/OrdersPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import RatingsPage from './pages/RatingsPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <span className="app-loading__icon">🌿</span>
        <span className="app-loading__text">Loading SaverFwd...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function PublicRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AuthModalProvider>
          <div className="app-shell">
            <Header />
            <AuthModal />
            <div className="app-main">
              <Routes>
                {/* Public routes */}
                <Route element={<PublicRoute />}>
                  <Route path="/" element={<LandingPage />} />
                </Route>

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/browse" element={<BrowseFoodPage />} />
                  <Route path="/food/:id" element={<FoodDetailPage />} />
                  <Route path="/create-listing" element={<CreateListingPage />} />
                  <Route path="/my-listings" element={<MyListingsPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/messages/:chatId" element={<MessagesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/ratings" element={<RatingsPage />} />
                </Route>

                {/* Info pages (public, no auth needed) */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </div>
          </div>
          <ToastContainer />
          </AuthModalProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
