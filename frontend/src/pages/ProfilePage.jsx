import { useState, useEffect } from 'react';
import { Camera, Mail, Phone, Package, ShoppingBag, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import userApi from '../api/userApi';
import StarRating from '../components/common/StarRating';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { SkeletonText } from '../components/common/SkeletonLoader';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await userApi.getStats();
        setStats(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userApi.updateProfile(formData);
      updateUser(data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile">
        <div className="profile__card">
          <SkeletonText width="200px" height="200px" className="skeleton--circle" />
          <SkeletonText width="50%" height="1.5rem" />
          <SkeletonText width="30%" />
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile__card">
        <div className="profile__avatar">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.fullName} />
          ) : (
            <span>{user?.fullName?.charAt(0) || 'U'}</span>
          )}
          <label className="profile__avatar-edit">
            <Camera size={16} />
            <input type="file" accept="image/*" hidden />
          </label>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="profile__edit-form">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))}
            />
            <div className="profile__edit-actions">
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <>
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
            </div>

            {user?.rating && (
              <div className="profile__rating">
                <StarRating rating={user.rating} size={20} readonly />
                <span>{user.rating} rating</span>
              </div>
            )}

            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="profile__stats">
          <div className="profile__stat-card">
            <Package size={24} color="var(--color-primary)" />
            <span className="profile__stat-value">{stats.foodListed ?? 0}</span>
            <span className="profile__stat-label">Food Listed</span>
          </div>
          <div className="profile__stat-card">
            <ShoppingBag size={24} color="var(--color-info)" />
            <span className="profile__stat-value">{stats.foodClaimed ?? 0}</span>
            <span className="profile__stat-label">Claimed/Sold</span>
          </div>
          <div className="profile__stat-card">
            <Leaf size={24} color="var(--color-success)" />
            <span className="profile__stat-value">{stats.foodSaved ?? 0} kg</span>
            <span className="profile__stat-label">Food Saved</span>
          </div>
        </div>
      )}
    </div>
  );
}
