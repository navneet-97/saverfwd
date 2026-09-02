import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Package, ShoppingBag, Leaf, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import foodApi from '../api/foodApi';
import orderApi from '../api/orderApi';
import ratingApi from '../api/ratingApi';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    foodListed: 0,
    ordersPlaced: 0,
    averageRating: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [listingsRes, ordersRes, ratingsRes] = await Promise.allSettled([
          foodApi.getMyListings({ page: 0, size: 1 }),
          orderApi.getOrders({}, { page: 0, size: 1 }),
          ratingApi.getRatings({}, { page: 0, size: 1 }),
        ]);

        const foodListed = listingsRes.status === 'fulfilled'
          ? (listingsRes.value?.totalElements || 0) : 0;
        const ordersPlaced = ordersRes.status === 'fulfilled'
          ? (ordersRes.value?.totalElements || 0) : 0;
        const totalRatings = ratingsRes.status === 'fulfilled'
          ? (ratingsRes.value?.totalElements || 0) : 0;

        setStats({
          foodListed,
          ordersPlaced,
          totalRatings,
          averageRating: 0,
        });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="profile">
      <div className="profile__card">
        <div className="profile__avatar">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.fullName} />
          ) : (
            <span>{user?.fullName?.charAt(0) || 'U'}</span>
          )}
        </div>

        <h1 className="profile__name">{user?.fullName}</h1>

        <div className="profile__info">
          <div className="profile__info-item">
            <Mail size={16} />
            <span>{user?.email}</span>
          </div>
          {user?.phoneNumber && (
            <div className="profile__info-item">
              <Phone size={16} />
              <span>{user?.phoneNumber}</span>
            </div>
          )}
          {user?.role && (
            <div className="profile__info-item">
              <span className="profile__role-badge">{user.role}</span>
            </div>
          )}
        </div>

        {user?.accountStatus && (
          <span className={`profile__status profile__status--${user.accountStatus.toLowerCase()}`}>
            {user.accountStatus}
          </span>
        )}

        <div className="profile__card-actions">
          <Link to="/my-listings" className="btn btn--primary btn--sm">
            <Package size={16} /> My Listings
          </Link>
          <Link to="/orders" className="btn btn--secondary btn--sm">
            <ShoppingBag size={16} /> My Orders
          </Link>
          <Link to="/ratings" className="btn btn--ghost btn--sm">
            <Star size={16} /> My Ratings
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="profile__stats">
        <div className="profile__stat-card">
          <Package size={24} color="var(--color-primary)" />
          <span className="profile__stat-value">{loading ? '—' : stats.foodListed}</span>
          <span className="profile__stat-label">Food Listed</span>
        </div>
        <div className="profile__stat-card">
          <ShoppingBag size={24} color="var(--color-info)" />
          <span className="profile__stat-value">{loading ? '—' : stats.ordersPlaced}</span>
          <span className="profile__stat-label">Orders Placed</span>
        </div>
        <Link to="/ratings" className="profile__stat-card profile__stat-card--link">
          <Star size={24} color="#eab308" />
          <span className="profile__stat-value">{loading ? '—' : stats.totalRatings}</span>
          <span className="profile__stat-label">Ratings Received</span>
        </Link>
        <div className="profile__stat-card">
          <Leaf size={24} color="var(--color-success)" />
          <span className="profile__stat-value">{loading ? '—' : stats.foodListed + stats.ordersPlaced}</span>
          <span className="profile__stat-label">Total Activity</span>
        </div>
      </div>
    </div>
  );
}
