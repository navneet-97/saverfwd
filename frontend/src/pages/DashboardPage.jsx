import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Package, ShoppingBag, Leaf, Sparkles } from 'lucide-react';
import AnimatedFoodSvg from '../components/common/AnimatedFoodSvg';
import { useAuth } from '../context/AuthContext';
import foodApi from '../api/foodApi';
import orderApi from '../api/orderApi';
import FoodCard from '../components/food/FoodCard';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    foodListed: 0,
    foodClaimed: 0,
    foodSaved: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [listingsRes, ordersRes] = await Promise.allSettled([
          foodApi.getMyListings({ page: 0, size: 1 }),
          orderApi.getOrders({}, { page: 0, size: 1 }),
        ]);

        const foodListed = listingsRes.status === 'fulfilled'
          ? (listingsRes.value?.totalElements || 0) : 0;
        const foodClaimed = ordersRes.status === 'fulfilled'
          ? (ordersRes.value?.totalElements || 0) : 0;

        setStats({
          foodListed,
          foodClaimed,
          foodSaved: foodListed + foodClaimed,
        });
      } catch {
        // silent
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="dashboard__welcome">
        <div className="dashboard__welcome-content">
          <div className="dashboard__welcome-greeting">
            <Sparkles size={20} />
            <span>Welcome back, {firstName}</span>
          </div>
          <h1 className="dashboard__welcome-title">
            Ready to reduce food waste?
          </h1>
          <p className="dashboard__welcome-subtitle">
            Find food to claim or share your extras with the community.
          </p>
          <div className="dashboard__welcome-actions">
            <Link to="/browse" className="btn btn--primary">
              Browse Food <ArrowRight size={18} />
            </Link>
            <Link to="/create-listing" className="btn btn--secondary">
              <Plus size={18} /> List Food
            </Link>
          </div>
        </div>
        <div className="dashboard__welcome-decoration">
          <AnimatedFoodSvg size={140} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="dashboard__stats-row">
        <Link to="/my-listings" className="dashboard__stat-card dashboard__stat-card--link">
          <div className="dashboard__stat-icon dashboard__stat-icon--green">
            <Package size={22} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{statsLoading ? '—' : stats.foodListed}</span>
            <span className="dashboard__stat-label">Food Listed</span>
          </div>
        </Link>
        <Link to="/orders" className="dashboard__stat-card dashboard__stat-card--link">
          <div className="dashboard__stat-icon dashboard__stat-icon--blue">
            <ShoppingBag size={22} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{statsLoading ? '—' : stats.foodClaimed}</span>
            <span className="dashboard__stat-label">Orders Placed</span>
          </div>
        </Link>
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon dashboard__stat-icon--amber">
            <Leaf size={22} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{statsLoading ? '—' : stats.foodSaved}</span>
            <span className="dashboard__stat-label">Total Impact</span>
          </div>
        </div>
      </div>

      {/* Nearby Food */}
      <div className="dashboard__listings">
        <div className="dashboard__section-header">
          <div className="dashboard__section-title-wrap">
            <h3 className="dashboard__section-title">Available Food Nearby</h3>
            <span className="dashboard__section-count">
              {loading ? '' : `${listings.length} items`}
            </span>
          </div>
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
            <div className="dashboard__empty-icon-wrap">
              <span className="dashboard__empty-icon">🌱</span>
            </div>
            <p className="dashboard__empty-title">No listings nearby</p>
            <p className="dashboard__empty-text">
              Be the first to share food in your area!
            </p>
            <Link to="/create-listing" className="btn btn--secondary">
              <Plus size={16} /> List Food
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
