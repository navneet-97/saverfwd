import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import foodApi from '../api/foodApi';
import userApi from '../api/userApi';
import FoodCard from '../components/food/FoodCard';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import Button from '../components/common/Button';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, statsRes] = await Promise.allSettled([
          foodApi.getRecommendedListings(),
          userApi.getStats(),
        ]);

        if (listingsRes.status === 'fulfilled') {
          const data = listingsRes.value.data;
          setListings(Array.isArray(data) ? data : data.content || []);
        }
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data);
        }
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
          <h1>Welcome back, {firstName}</h1>
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

      {/* Impact */}
      {stats && (
        <div className="dashboard__impact">
          <h3 className="dashboard__section-title">Your Impact</h3>
          <div className="dashboard__impact-grid">
            <div className="dashboard__impact-card">
              <span className="dashboard__impact-value">{stats.foodListed ?? 0}</span>
              <span className="dashboard__impact-label">Food Listed</span>
            </div>
            <div className="dashboard__impact-card">
              <span className="dashboard__impact-value">{stats.foodClaimed ?? 0}</span>
              <span className="dashboard__impact-label">Food Claimed</span>
            </div>
            <div className="dashboard__impact-card">
              <span className="dashboard__impact-value">{stats.foodSaved ?? 0} kg</span>
              <span className="dashboard__impact-label">Food Saved</span>
            </div>
          </div>
        </div>
      )}

      {/* Recommended */}
      <div className="dashboard__listings">
        <div className="dashboard__section-header">
          <h3 className="dashboard__section-title">Nearby Food</h3>
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
            {listings.slice(0, 4).map((listing) => (
              <FoodCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="dashboard__empty">
            <p>No food listings available nearby right now.</p>
            <Button onClick={() => window.location.href = '/browse'}>
              Browse All Food
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
