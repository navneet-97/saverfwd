import { MessageSquare } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function MessagesPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <EmptyState
        icon={MessageSquare}
        title="Messaging coming soon"
        description="Direct messaging between users will be available soon. This will help coordinate food pickups and answer questions about listings."
      />
    </div>
  );
}
