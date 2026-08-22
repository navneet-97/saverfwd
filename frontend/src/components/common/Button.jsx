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
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner">
          <span className="spinner" />
        </span>
      )}
      {children}
    </button>
  );
}
