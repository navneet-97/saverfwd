import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, User, Navigation, MessageSquare, ArrowLeft, Leaf, CheckCircle, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import foodApi from '../api/foodApi';
import orderApi from '../api/orderApi';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { SkeletonText } from '../components/common/SkeletonLoader';
import { CURRENCY_SYMBOL, STATUS_COLORS, getFoodTypeLabel, getUnitLabel, getFoodTypeIcon } from '../utils/constants';
import { formatDate, formatTime, getTimeUntil, formatDateTime } from '../utils/formatters';
import './FoodDetailPage.css';

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimQty, setClaimQty] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await foodApi.getListing(id);
        setListing(data);
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error('This food listing no longer exists.');
        } else {
          toast.error('Failed to load food listing.');
        }
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="food-detail">
        <div className="food-detail__hero">
          <div className="skeleton skeleton--image" style={{ height: 280 }} />
        </div>
        <div className="food-detail__body">
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
  const isOwner = user?.id === listing.ownerId;
  const statusStyle = STATUS_COLORS[listing.status] || STATUS_COLORS.AVAILABLE;
  const canClaim = listing.status === 'AVAILABLE' && !isOwner;

  const handleClaim = async () => {
    const qty = Number(claimQty);
    if (!qty || qty <= 0) {
      toast.error('Please enter a valid quantity.');
      return;
    }
    if (qty > Number(listing.quantity)) {
      toast.error(`Only ${listing.quantity} ${getUnitLabel(listing.unit)} available.`);
      return;
    }

    setClaimLoading(true);
    try {
      await orderApi.createOrder(listing.id, qty);
      setClaimSuccess(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="food-detail">
      {/* Hero */}
      <div className="food-detail__hero">
        <button className="food-detail__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="food-detail__hero-bg">
          <span className="food-detail__hero-icon">{getFoodTypeIcon(listing.foodType)}</span>
        </div>
        {listing.status && listing.status !== 'AVAILABLE' && (
          <Badge color={statusStyle.text} bg={statusStyle.bg} className="food-detail__status-badge">
            {listing.status}
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="food-detail__body">
        <div className="food-detail__content">
          {/* Title Card */}
          <div className="food-detail__title-card">
            <div className="food-detail__title-row">
              <div className="food-detail__title-info">
                <div className="food-detail__type-badge">
                  <Package size={14} />
                  <span>{getFoodTypeLabel(listing.foodType)}</span>
                </div>
                <h1 className="food-detail__title">{listing.title}</h1>
                <div className="food-detail__meta">
                  <span>{listing.quantity} {getUnitLabel(listing.unit)}</span>
                  <span className="food-detail__meta-dot">·</span>
                  <span>Listed by User #{listing.ownerId}</span>
                </div>
              </div>
              <div className="food-detail__price-badge">
                {isDonation ? (
                  <span className="food-detail__price food-detail__price--free">
                    <Leaf size={16} /> FREE
                  </span>
                ) : (
                  <span className="food-detail__price">{CURRENCY_SYMBOL}{listing.price}</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="food-detail__card">
              <h3 className="food-detail__card-title">About this food</h3>
              <p className="food-detail__description">{listing.description}</p>
            </div>
          )}

          {/* Pickup Details */}
          <div className="food-detail__card">
            <h3 className="food-detail__card-title">Pickup Details</h3>
            <div className="food-detail__info-grid">
              <div className="food-detail__info-row">
                <div className="food-detail__info-icon">
                  <MapPin size={18} />
                </div>
                <div className="food-detail__info-content">
                  <span className="food-detail__info-label">Address</span>
                  <span className="food-detail__info-value">{listing.pickupAddress}</span>
                </div>
              </div>

              {listing.pickupStartTime && (
                <div className="food-detail__info-row">
                  <div className="food-detail__info-icon food-detail__info-icon--blue">
                    <Clock size={18} />
                  </div>
                  <div className="food-detail__info-content">
                    <span className="food-detail__info-label">Pickup Window</span>
                    <span className="food-detail__info-value">
                      {formatDate(listing.pickupStartTime)} · {formatTime(listing.pickupStartTime)}
                      {listing.pickupEndTime && ` – ${formatTime(listing.pickupEndTime)}`}
                    </span>
                  </div>
                </div>
              )}

              {listing.expiryTime && (
                <div className="food-detail__info-row">
                  <div className="food-detail__info-icon food-detail__info-icon--amber">
                    <Calendar size={18} />
                  </div>
                  <div className="food-detail__info-content">
                    <span className="food-detail__info-label">Expires</span>
                    <span className="food-detail__info-value">
                      {formatDateTime(listing.expiryTime)}
                      <span className="food-detail__time-until">({getTimeUntil(listing.expiryTime)})</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="food-detail__sidebar">
          <div className="food-detail__actions-card">
            {canClaim && !claimSuccess && (
              <>
                <div className="food-detail__claim-section">
                  <Input
                    label={`Quantity (${getUnitLabel(listing.unit)})`}
                    name="claimQty"
                    type="number"
                    placeholder={`Max: ${listing.quantity}`}
                    min="0.01"
                    max={listing.quantity}
                    step="any"
                    value={claimQty}
                    onChange={(e) => setClaimQty(e.target.value)}
                  />
                  <Button
                    fullWidth
                    size="lg"
                    loading={claimLoading}
                    onClick={handleClaim}
                  >
                    {isDonation ? 'Claim Food' : `Pay ${CURRENCY_SYMBOL}${listing.price}`}
                  </Button>
                </div>
                <Link to="/messages" className="btn btn--secondary btn--full">
                  <MessageSquare size={18} /> Message User
                </Link>
              </>
            )}

            {canClaim && claimSuccess && (
              <div className="food-detail__claim-success">
                <div className="food-detail__success-icon">
                  <CheckCircle size={36} />
                </div>
                <p className="food-detail__claim-success-title">Order Placed!</p>
                <p className="food-detail__claim-success-text">
                  Your order has been placed successfully. Check your orders for details.
                </p>
                <Link to="/orders" className="btn btn--secondary btn--full">
                  View Orders
                </Link>
              </div>
            )}

            {isOwner && (
              <Link to="/my-listings" className="btn btn--secondary btn--full">
                Manage Listing
              </Link>
            )}

            {!canClaim && !isOwner && !claimSuccess && (
              <div className="food-detail__unavailable">
                <p>This food is no longer available.</p>
              </div>
            )}

            {listing.pickupAddress && (
              <Button
                fullWidth
                variant="ghost"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(listing.pickupAddress)}`, '_blank')}
              >
                <Navigation size={18} /> Get Directions
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
