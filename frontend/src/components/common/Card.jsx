import './Card.css';

export default function Card({ children, className = '', hoverable = true, onClick, ...props }) {
  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={`card ${hoverable ? 'card--hoverable' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`card__body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`card__footer ${className}`}>{children}</div>;
}
