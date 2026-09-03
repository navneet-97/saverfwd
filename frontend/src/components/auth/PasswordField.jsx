import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../common/Input';
import { isPasswordValid, PASSWORD_HINT } from '../../utils/validators';
import './PasswordField.css';

// Password input with a plain one-line requirements hint and a show/hide toggle.
// While the typed value is non-empty and doesn't meet every rule the input stays
// red — the parent disables submit until the password is valid.
export default function PasswordField({
  label = 'Password',
  value,
  onChange,
  onBlur,
  error = '',
  placeholder = 'Enter your password',
  autoComplete = 'new-password',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const invalid = value !== '' && !isPasswordValid(value);

  return (
    <div className="password-field">
      <Input
        className={invalid ? 'input-group--error' : ''}
        label={label}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={error}
        required
        autoComplete={autoComplete}
        rightAdornment={
          <button
            type="button"
            className="input-wrap__adornment"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            // Keep focus in the input while toggling visibility
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />
      <p className="password-field__hint">{PASSWORD_HINT}</p>
    </div>
  );
}
