import { Inbox } from 'lucide-react';
import Button from './Button';
import './EmptyState.css';

export default function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
