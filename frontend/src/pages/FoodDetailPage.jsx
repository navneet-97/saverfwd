import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, User, Navigation, MessageSquare, ArrowLeft, Leaf, Loader2, CheckCircle } from 'lucide-react';
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
        <div className="food-detail__image-wrap">
          <div className="skeleton skeleton--image" style={{ height: 300 }} />
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
      <button className="food-detail__back" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>

      {/* Food Image / Placeholder */}
      <div className="food-detail__image-wrap">
        <div className="food-detail__image-placeholder">
          <span className="food-detail__food-icon">{getFoodTypeIcon(listing.foodType)}</span>
        </div>
        {listing.status && listing.status !== 'AVAILABLE' && (
          <Badge color={statusStyle.text} bg={statusStyle.bg} className="food-detail__status">
            {listing.status}
          </Badge>
        )}
      </div>

      <div className="food-detail__layout">
        <div className="food-detail__main">
          <div className="food-detail__title-row">
            <div>
              <h1 className="food-detail__title">{listing.title}</h1>
              <div className="food-detail__meta">
                <span>{getFoodTypeLabel(listing.foodType)}</span>
                <span>·</span>
                <span>{listing.quantity} {getUnitLabel(listing.unit)}</span>
              </div>
            </div>
            <div className="food-detail__price-col">
              {isDonation ? (
                <span className="food-detail__price food-detail__price--free">
                  <Leaf size={16} /> FREE
                </span>
              ) : (
                <span className="food-detail__price">{CURRENCY_SYMBOL}{listing.price}</span>
              )}
            </div>
          </div>

          {listing.description && (
            <div className="food-detail__section">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>
          )}

          <div className="food-detail__section">
            <h3>Pickup Details</h3>
            <div className="food-detail__info-card">
              <div className="food-detail__info-item">
                <MapPin size={16} />
                <div>
                  <span className="food-detail__info-label">Address</span>
                  <span className="food-detail__info-value">{listing.pickupAddress}</span>
                </div>
              </div>
              {listing.pickupStartTime && (
                <div className="food-detail__info-item">
                  <Clock size={16} />
                  <div>
                    <span className="food-detail__info-label">Pickup Window</span>
                    <span className="food-detail__info-value">
                      {formatDate(listing.pickupStartTime)} · {formatTime(listing.pickupStartTime)}
                      {listing.pickupEndTime && ` – ${formatTime(listing.pickupEndTime)}`}
                    </span>
                  </div>
                </div>
              )}
              {listing.expiryTime && (
                <div className="food-detail__info-item">
                  <Calendar size={16} />
                  <div>
                    <span className="food-detail__info-label">Expires</span>
                    <span className="food-detail__info-value">
                      {formatDateTime(listing.expiryTime)} ({getTimeUntil(listing.expiryTime)})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Listed by */}
          <div className="food-detail__section">
            <h3>Listed by</h3>
            <div className="food-detail__user">
              <div className="food-detail__user-avatar">
                <User size={20} />
              </div>
              <div>
                <span className="food-detail__user-name">User #{listing.ownerId}</span>
                <span className="food-detail__user-id">Listing ID: {listing.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
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
                <Button fullWidth variant="secondary" as={Link} to="/messages">
                  <MessageSquare size={18} /> Message User
                </Button>
              </>
            )}

            {canClaim && claimSuccess && (
              <div className="food-detail__claim-success">
                <CheckCircle size={32} />
                <p className="food-detail__claim-success-title">Order Placed!</p>
                <p className="food-detail__claim-success-text">
                  Your order has been placed successfully. Check your orders for details.
                </p>
                <Button fullWidth variant="secondary" as={Link} to="/orders">
                  View Orders
                </Button>
              </div>
            )}

            {isOwner && (
              <Button fullWidth variant="secondary" as={Link} to="/my-listings">
                Manage Listing
              </Button>
            )}

            {!canClaim && !isOwner && !claimSuccess && (
              <p className="food-detail__unavailable">
                This food is no longer available.
              </p>
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
