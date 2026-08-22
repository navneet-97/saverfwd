import { Bell } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function NotificationsPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Notifications</h1>
      </div>
      <EmptyState
        icon={Bell}
        title="No notifications"
        description="Notifications will appear here when there's activity on your listings and orders."
      />
    </div>
  );
}
