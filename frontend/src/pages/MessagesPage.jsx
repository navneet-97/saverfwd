import { MessageSquare } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import './MyListingsPage.css';

export default function MessagesPage() {
  return (
    <div className="my-listings" style={{ maxWidth: 600 }}>
      <div className="my-listings__header">
        <h1>Messages</h1>
      </div>
      <EmptyState
        icon={MessageSquare}
        title="Messaging coming soon"
        description="Direct messaging between users will be available soon. This will help coordinate food pickups and answer questions about listings."
      />
    </div>
  );
}
