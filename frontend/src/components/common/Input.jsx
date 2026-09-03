import './Input.css';

export default function Input({
  label,
  error,
  type = 'text',
  className = '',
  required,
  rightAdornment,
  ...props
}) {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className={`input-wrap${rightAdornment ? ' input-wrap--adorned' : ''}`}>
        <input type={type} className="input" {...props} />
        {rightAdornment}
      </div>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

export function Select({ label, error, options = [], placeholder, className = '', required, ...props }) {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <select className="input input--select" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', required, ...props }) {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <textarea className="input input--textarea" rows={4} {...props} />
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
