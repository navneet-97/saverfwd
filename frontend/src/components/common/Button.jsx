import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${loading ? 'btn--loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner">
          <span className="spinner" />
        </span>
      )}
      {!loading && Icon && <Icon size={size === 'sm' ? 15 : size === 'lg' ? 20 : 17} />}
      {children && <span className="btn__text">{children}</span>}
    </button>
  );
}
