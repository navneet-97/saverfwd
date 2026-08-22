import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import './Toast.css';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info;
        return (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <Icon size={18} className="toast__icon" />
            <p className="toast__message">{t.message}</p>
            <button className="toast__close" onClick={() => removeToast(t.id)}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
