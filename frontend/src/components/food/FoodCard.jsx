import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Leaf } from 'lucide-react';
import Badge from '../common/Badge';
import { STATUS_COLORS, CURRENCY_SYMBOL, getFoodTypeLabel, getUnitLabel, getFoodTypeIcon } from '../../utils/constants';
import { getTimeUntil, formatTime } from '../../utils/formatters';
import './FoodCard.css';

export default function FoodCard({ listing }) {
  const navigate = useNavigate();

  const {
    id,
    title,
    foodType,
    quantity,
    unit,
    listingType,
    price,
    pickupAddress,
    pickupStartTime,
    pickupEndTime,
    expiryTime,
    status,
  } = listing;

  const isDonation = listingType === 'DONATION';
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.AVAILABLE;

  const handleClick = () => {
    navigate(`/food/${id}`);
  };

  // Format pickup time display
  let pickupDisplay = '';
  if (pickupStartTime && pickupEndTime) {
    pickupDisplay = `${formatTime(pickupStartTime)} – ${formatTime(pickupEndTime)}`;
  } else if (pickupStartTime) {
    pickupDisplay = formatTime(pickupStartTime);
  }

  // Get pickup date
  const pickupDate = pickupStartTime ? new Date(pickupStartTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  return (
    <article className="food-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="food-card__image-wrap">
        <div className="food-card__image-placeholder">
          <span className="food-card__food-icon">{getFoodTypeIcon(foodType)}</span>
        </div>
        {isDonation && (
          <div className="food-card__donation-badge">
            <Leaf size={12} /> FREE
          </div>
        )}
        {status && status !== 'AVAILABLE' && (
          <div className="food-card__status-badge">
            <Badge color={statusStyle.text} bg={statusStyle.bg}>
              {status}
            </Badge>
          </div>
        )}
      </div>

      <div className="food-card__body">
        <div className="food-card__header">
          <h3 className="food-card__title">{title}</h3>
          {!isDonation && (
            <span className="food-card__price">
              {CURRENCY_SYMBOL}{price}
            </span>
          )}
        </div>

        <div className="food-card__meta">
          <span className="food-card__type">{getFoodTypeLabel(foodType)}</span>
          <span className="food-card__qty">
            {quantity} {getUnitLabel(unit)}
          </span>
        </div>

        {pickupAddress && (
          <div className="food-card__info">
            <MapPin size={14} />
            <span>{pickupAddress.length > 40 ? pickupAddress.substring(0, 40) + '…' : pickupAddress}</span>
          </div>
        )}

        {pickupDisplay && (
          <div className="food-card__info">
            <Clock size={14} />
            <span>{pickupDate && `${pickupDate} · `}{pickupDisplay}</span>
          </div>
        )}

        {expiryTime && (
          <div className="food-card__expiry">
            {getTimeUntil(expiryTime)}
          </div>
        )}
      </div>
    </article>
  );
}
