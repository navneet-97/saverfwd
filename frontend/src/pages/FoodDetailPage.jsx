import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, User, Navigation, MessageSquare, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import foodApi from '../api/foodApi';
import orderApi from '../api/orderApi';
import StarRating from '../components/common/StarRating';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { SkeletonText } from '../components/common/SkeletonLoader';
import { CURRENCY_SYMBOL, STATUS_COLORS, getFoodTypeLabel, getUnitLabel } from '../utils/constants';
import { formatDate, formatTime, getTimeUntil, formatDateTime } from '../utils/formatters';
import './FoodDetailPage.css';

const FOOD_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" fill="%23f3f4f6"%3E%3Crect width="800" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await foodApi.getListing(id);
        setListing(data);
      } catch {
        toast.error('Failed to load food listing.');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate, toast]);

  const handleAction = async () => {
    setActionLoading(true);
    try {
      if (actionType === 'claim') {
        await orderApi.claimFood(id);
        toast.success('Food claimed successfully!');
      } else {
        await orderApi.purchaseFood(id);
        toast.success('Purchase completed!');
      }
      const { data } = await foodApi.getListing(id);
      setListing(data);
      setShowConfirmModal(false);
      navigate('/orders');
    } catch (err) {
      if (err.status === 409) {
        toast.error('Sorry, this food has already been claimed.');
        const { data } = await foodApi.getListing(id);
        setListing(data);
      } else {
        toast.error(err.message || 'Action failed. Please try again.');
      }
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  };

  const openConfirmModal = (type) => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  if (loading) {
    return (
      <div className="food-detail">
        <div className="food-detail__image-wrap">
          <div className="skeleton skeleton--image" style={{ height: 400 }} />
        </div>
        <div className="food-detail__content">
          <SkeletonText width="50%" height="1.5rem" />
          <SkeletonText width="30%" />
          <SkeletonText width="100%" />
          <SkeletonText width="80%" />
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const isDonation = listing.listingType === 'DONATION';
  const isOwner = user?.id === listing.userId || user?.id === listing.user?.id;
  const expiryDateTime = listing.expiryDate && listing.expiryTime
    ? `${listing.expiryDate}T${listing.expiryTime}` : listing.expiryDate;
  const statusStyle = STATUS_COLORS[listing.status] || STATUS_COLORS.AVAILABLE;
  const canClaim = listing.status === 'AVAILABLE' && !isOwner;

  return (
    <div className="food-detail">
      <button className="food-detail__back" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="food-detail__layout">
        <div className="food-detail__image-wrap">
          <img
            src={listing.imageUrl || FOOD_PLACEHOLDER}
            alt={listing.title}
            className="food-detail__image"
          />
          {listing.status && listing.status !== 'AVAILABLE' && (
            <Badge color={statusStyle.color} bg={statusStyle.bg} className="food-detail__status">
              {listing.status}
            </Badge>
          )}
        </div>

        <div className="food-detail__sidebar">
          <div className="food-detail__content">
            <div className="food-detail__title-row">
              <h1 className="food-detail__title">{listing.title}</h1>
              {isDonation ? (
                <span className="food-detail__price food-detail__price--free">FREE</span>
              ) : (
                <span className="food-detail__price">{CURRENCY_SYMBOL}{listing.price}</span>
              )}
            </div>

            <div className="food-detail__meta">
              <span>{getFoodTypeLabel(listing.foodType)}</span>
              <span>·</span>
              <span>{listing.quantity} {getUnitLabel(listing.unit)}</span>
            </div>

            {listing.description && (
              <div className="food-detail__section">
                <h3>Description</h3>
                <p>{listing.description}</p>
              </div>
            )}

            <div className="food-detail__section">
              <h3>Pickup</h3>
              <div className="food-detail__info-item">
                <MapPin size={16} />
                <span>{listing.pickupAddress}</span>
              </div>
              {listing.pickupStartTime && (
                <div className="food-detail__info-item">
                  <Clock size={16} />
                  <span>
                    {formatDate(listing.pickupStartTime || listing.pickupDate)}{' '}
                    {formatTime(listing.pickupStartTime)}
                    {listing.pickupEndTime && ` – ${formatTime(listing.pickupEndTime)}`}
                  </span>
                </div>
              )}
            </div>

            {expiryDateTime && (
              <div className="food-detail__section">
                <h3>Expires</h3>
                <div className="food-detail__info-item">
                  <Calendar size={16} />
                  <span>{formatDateTime(expiryDateTime)} ({getTimeUntil(expiryDateTime)})</span>
                </div>
              </div>
            )}

            {listing.user && (
              <div className="food-detail__section">
                <h3>Listed by</h3>
                <div className="food-detail__user">
                  <div className="food-detail__user-avatar">
                    {listing.user.profilePicture ? (
                      <img src={listing.user.profilePicture} alt="" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div>
                    <span className="food-detail__user-name">{listing.user.fullName}</span>
                    {listing.user.rating && (
                      <div className="food-detail__user-rating">
                        <StarRating rating={listing.user.rating} size={14} readonly />
                        <span>{listing.user.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="food-detail__actions">
            {canClaim && (
              <>
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => openConfirmModal(isDonation ? 'claim' : 'purchase')}
                >
                  {isDonation ? 'Claim Food' : 'Purchase Food'}
                </Button>
                <Button fullWidth variant="secondary" size="lg" as={Link} to="/messages">
                  <MessageSquare size={18} /> Message User
                </Button>
                {listing.pickupAddress && (
                  <Button
                    fullWidth
                    variant="ghost"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(listing.pickupAddress)}`, '_blank')}
                  >
                    <Navigation size={18} /> Get Directions
                  </Button>
                )}
              </>
            )}
            {isOwner && (
              <Button fullWidth variant="secondary" as={Link} to={`/my-listings`}>
                Manage Listing
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={actionType === 'claim' ? 'Confirm Claim' : 'Confirm Purchase'}
      >
        <div className="food-detail__confirm">
          <p>
            {actionType === 'claim'
              ? `You are about to claim "${listing.title}". Are you sure?`
              : `You are about to purchase "${listing.title}" for ${CURRENCY_SYMBOL}${listing.price}. Continue?`}
          </p>
          <div className="food-detail__confirm-actions">
            <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button loading={actionLoading} onClick={handleAction}>
              {actionType === 'claim' ? 'Confirm Claim' : 'Confirm Purchase'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
