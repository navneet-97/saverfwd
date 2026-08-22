import { ShoppingBag } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import './MyListingsPage.css';

export default function OrdersPage() {
  return (
    <div className="my-listings" style={{ maxWidth: 600 }}>
      <div className="my-listings__header">
        <h1>My Orders</h1>
      </div>
      <EmptyState
        icon={ShoppingBag}
        title="Orders coming soon"
        description="The ability to claim and purchase food will be available soon. In the meantime, you can browse available food listings."
        actionLabel="Browse Food"
        onAction={() => window.location.href = '/browse'}
      />
    </div>
  );
}
