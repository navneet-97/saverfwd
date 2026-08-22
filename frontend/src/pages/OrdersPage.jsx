import { ShoppingBag } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function OrdersPage() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>My Orders</h1>
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
