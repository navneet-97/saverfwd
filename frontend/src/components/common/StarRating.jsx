import { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

export default function StarRating({ rating = 0, size = 18, readonly = false, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating" role="group" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readonly ? star <= Math.round(rating) : star <= (hovered || rating);
        return (
          <button
            key={star}
            type="button"
            className={`star-rating__star ${filled ? 'star-rating__star--filled' : ''}`}
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
          >
            <Star size={size} fill={filled ? 'currentColor' : 'none'} />
          </button>
        );
      })}
      {!readonly && rating > 0 && (
        <span className="star-rating__value">{rating}</span>
      )}
    </div>
  );
}
