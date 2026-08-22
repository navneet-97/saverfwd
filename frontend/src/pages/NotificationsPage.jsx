import { Bell } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import './MyListingsPage.css';

export default function NotificationsPage() {
  return (
    <div className="my-listings" style={{ maxWidth: 600 }}>
      <div className="my-listings__header">
        <h1>Notifications</h1>
      </div>
      <EmptyState
        icon={Bell}
        title="No notifications"
        description="Notifications will appear here when there's activity on your listings and orders."
      />
    </div>
  );
}
