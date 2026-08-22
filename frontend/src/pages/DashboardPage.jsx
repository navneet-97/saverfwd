import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Package, ShoppingBag, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import foodApi from '../api/foodApi';
import FoodCard from '../components/food/FoodCard';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await foodApi.getListings(
          { status: 'AVAILABLE', sort: 'createdAt', asc: false },
          { page: 0, size: 4 }
        );
        const content = result?.content || [];
        setListings(content);
      } catch {
        // Errors handled silently for dashboard
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="dashboard">
      {/* Welcome */}
      <div className="dashboard__welcome">
        <div className="dashboard__welcome-text">
          <h1>Welcome back, {firstName} 👋</h1>
          <p>Find food to claim or share your extras with the community.</p>
        </div>
        <div className="dashboard__welcome-actions">
          <Link to="/browse" className="btn btn--primary">
            Browse Food <ArrowRight size={18} />
          </Link>
          <Link to="/create-listing" className="btn btn--secondary">
            <Plus size={18} /> List Food
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard__stats-row">
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon dashboard__stat-icon--green">
            <Package size={20} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">—</span>
            <span className="dashboard__stat-label">Food Listed</span>
          </div>
        </div>
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon dashboard__stat-icon--blue">
            <ShoppingBag size={20} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">—</span>
            <span className="dashboard__stat-label">Food Claimed</span>
          </div>
        </div>
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon dashboard__stat-icon--leaf">
            <Leaf size={20} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">—</span>
            <span className="dashboard__stat-label">Food Saved</span>
          </div>
        </div>
      </div>

      {/* Nearby Food */}
      <div className="dashboard__listings">
        <div className="dashboard__section-header">
          <h3 className="dashboard__section-title">Available Food Nearby</h3>
          <Link to="/browse" className="dashboard__see-all">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="dashboard__grid">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="dashboard__grid">
            {listings.map((listing) => (
              <FoodCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="dashboard__empty">
            <span className="dashboard__empty-icon">🌱</span>
            <p>No food listings available nearby right now.</p>
            <Link to="/browse" className="btn btn--secondary">
              Browse All Food
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
