import { useState, useEffect } from 'react';
import { Mail, Phone, Package, ShoppingBag, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import foodApi from '../api/foodApi';
import Button from '../components/common/Button';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await foodApi.getMyListings({ page: 0, size: 1 });
        setStats({
          foodListed: result?.totalElements || 0,
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

        <Button variant="secondary" disabled>
          Edit Profile (Coming Soon)
        </Button>
      </div>

      {/* Stats */}
      <div className="profile__stats">
        <div className="profile__stat-card">
          <Package size={24} color="var(--color-primary)" />
          <span className="profile__stat-value">{loading ? '—' : (stats?.foodListed ?? 0)}</span>
          <span className="profile__stat-label">Food Listed</span>
        </div>
        <div className="profile__stat-card">
          <ShoppingBag size={24} color="var(--color-info)" />
          <span className="profile__stat-value">—</span>
          <span className="profile__stat-label">Claimed/Sold</span>
        </div>
        <div className="profile__stat-card">
          <Leaf size={24} color="var(--color-success)" />
          <span className="profile__stat-value">—</span>
          <span className="profile__stat-label">Food Saved</span>
        </div>
      </div>
    </div>
  );
}
