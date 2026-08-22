import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Clock } from 'lucide-react';
import orderApi from '../api/orderApi';
import { useToast } from '../context/ToastContext';
import Tabs from '../components/common/Tabs';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { STATUS_COLORS, CURRENCY_SYMBOL } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import './OrdersPage.css';

const TABS = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = activeTab !== 'ALL' ? { status: activeTab } : {};
      const { data } = await orderApi.getMyOrders(params);
      setOrders(Array.isArray(data) ? data : data.content || []);
    } catch {
      toast.error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderApi.cancelOrder(id);
      toast.success('Order cancelled.');
      fetchOrders();
    } catch {
      toast.error('Failed to cancel order.');
    }
  };

  const handleComplete = async (id) => {
    try {
      await orderApi.completeOrder(id);
      toast.success('Order marked as completed!');
      fetchOrders();
    } catch {
      toast.error('Failed to complete order.');
    }
  };

  return (
    <div className="orders">
      <div className="orders__header">
        <h1>My Orders</h1>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {loading ? (
        <SkeletonList count={4} />
      ) : orders.length > 0 ? (
        <div className="orders__list">
          {orders.map((order) => {
            const statusStyle = STATUS_COLORS[order.status] || {};
            return (
              <div key={order.id} className="orders__item">
                <div className="orders__item-image">
                  {order.foodImageUrl ? (
                    <img src={order.foodImageUrl} alt={order.foodTitle} />
                  ) : (
                    <ShoppingBag size={24} color="var(--color-text-muted)" />
                  )}
                </div>
                <div className="orders__item-info">
                  <div className="orders__item-title">
                    <Link to={`/orders/${order.id}`}>{order.foodTitle}</Link>
                    <Badge color={statusStyle.color} bg={statusStyle.bg}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="orders__item-meta">
                    {order.price > 0 && (
                      <span>{CURRENCY_SYMBOL}{order.price}</span>
                    )}
                    {order.listingType === 'DONATION' && (
                      <span>FREE</span>
                    )}
                    <span>{order.quantity} {order.unit}</span>
                    {order.sellerName && <span>by {order.sellerName}</span>}
                  </div>
                  {order.pickupAddress && (
                    <div className="orders__item-pickup">
                      <MapPin size={14} />
                      <span>{order.pickupAddress}</span>
                      {order.pickupStartTime && (
                        <>
                          <Clock size={14} />
                          <span>{formatDate(order.pickupStartTime)}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="orders__item-actions">
                  {order.status === 'PENDING' && (
                    <button className="btn btn--ghost btn--sm" style={{ color: 'var(--color-error)' }} onClick={() => handleCancel(order.id)}>
                      Cancel
                    </button>
                  )}
                  {order.status === 'CONFIRMED' && (
                    <>
                      <button className="btn btn--primary btn--sm" onClick={() => handleComplete(order.id)}>
                        Complete
                      </button>
                      <button className="btn btn--ghost btn--sm" style={{ color: 'var(--color-error)' }} onClick={() => handleCancel(order.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                  <Link to={`/orders/${order.id}`} className="btn btn--ghost btn--sm">
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="You don't have any orders yet."
          actionLabel="Browse Food"
          onAction={() => window.location.href = '/browse'}
        />
      )}
    </div>
  );
}
