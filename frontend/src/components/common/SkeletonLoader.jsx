import './SkeletonLoader.css';

export function SkeletonText({ width, height = '1rem' }) {
  return (
    <div
      className="skeleton skeleton--text"
      style={{ width, height }}
    />
  );
}

export function SkeletonCircle({ size = 40 }) {
  return (
    <div
      className="skeleton skeleton--circle"
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton--image" />
      <div className="skeleton-card__body">
        <SkeletonText width="70%" height="1.2rem" />
        <SkeletonText width="40%" height="0.875rem" />
        <SkeletonText width="100%" />
        <SkeletonText width="60%" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-list__item">
          <SkeletonCircle />
          <div className="skeleton-list__content">
            <SkeletonText width="60%" />
            <SkeletonText width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}
