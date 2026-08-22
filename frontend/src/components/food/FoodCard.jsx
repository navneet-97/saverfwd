import { useNavigate } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import Badge from '../common/Badge';
import { STATUS_COLORS, CURRENCY_SYMBOL, getFoodTypeLabel } from '../../utils/constants';
import { getTimeUntil } from '../../utils/formatters';
import './FoodCard.css';

const FOOD_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="240" fill="%23f3f4f6"%3E%3Crect width="400" height="240"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';

export default function FoodCard({ listing }) {
  const navigate = useNavigate();

  const {
    id,
    title,
    imageUrl,
    foodType,
    quantity,
    unit,
    listingType,
    price,
    pickupAddress,
    pickupStartTime,
    pickupEndTime,
    expiryDate,
    expiryTime,
    status,
  } = listing;

  const isDonation = listingType === 'DONATION';
  const expiryDateTime = expiryDate && expiryTime ? `${expiryDate}T${expiryTime}` : expiryDate;
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.AVAILABLE;

  const handleClick = () => {
    navigate(`/food/${id}`);
  };

  const pickupTimeDisplay = pickupStartTime && pickupEndTime
    ? `${pickupStartTime} - ${pickupEndTime}`
    : pickupStartTime || '';

  return (
    <article className="food-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="food-card__image-wrap">
        <img
          src={imageUrl || FOOD_PLACEHOLDER}
          alt={title}
          className="food-card__image"
          loading="lazy"
        />
        <div className="food-card__badges">
          {status && status !== 'AVAILABLE' && (
            <Badge color={statusStyle.color} bg={statusStyle.bg}>
              {status}
            </Badge>
          )}
        </div>
      </div>

      <div className="food-card__body">
        <div className="food-card__header">
          <h3 className="food-card__title">{title}</h3>
          {isDonation ? (
            <span className="food-card__price food-card__price--free">FREE</span>
          ) : (
            <span className="food-card__price">
              {CURRENCY_SYMBOL}{price}
            </span>
          )}
        </div>

        <div className="food-card__meta">
          <span className="food-card__type">{getFoodTypeLabel(foodType)}</span>
          <span className="food-card__qty">
            {quantity} {unit}
          </span>
        </div>

        {pickupAddress && (
          <div className="food-card__info">
            <MapPin size={14} />
            <span>{pickupAddress}</span>
          </div>
        )}

        {pickupTimeDisplay && (
          <div className="food-card__info">
            <Clock size={14} />
            <span>{pickupTimeDisplay}</span>
          </div>
        )}

        {expiryDateTime && (
          <div className="food-card__expiry">
            {getTimeUntil(expiryDateTime)}
          </div>
        )}
      </div>
    </article>
  );
}
