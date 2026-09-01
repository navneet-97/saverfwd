import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, XCircle, Package, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import orderApi from '../api/orderApi';
import Tabs from '../components/common/Tabs';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { CURRENCY_SYMBOL, STATUS_COLORS, getUnitLabel, getFoodTypeIcon } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import './MyListingsPage.css';
import './OrdersPage.css';

const TABS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'READY_FOR_PICKUP', label: 'Ready' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const ORDER_STATUS_COLORS = {
  PENDING: { bg: '#fffbeb', text: '#d97706' },
  CONFIRMED: { bg: '#eff6ff', text: '#2563eb' },
  READY_FOR_PICKUP: { bg: '#f0fdf4', text: '#16a34a' },
  COMPLETED: { bg: '#f0fdf4', text: '#16a34a' },
  CANCELLED: { bg: '#fef2f2', text: '#dc2626' },
};

const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  READY_FOR_PICKUP: 'Ready for Pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const filter = {};
      if (activeTab) filter.status = activeTab;

      const result = await orderApi.getOrders(filter, { page, size: 10 });
      const content = result?.content || [];
      setOrders(content);
      setTotalPages(result?.totalPages || 1);
      setTotalElements(result?.totalElements || 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderApi.updateOrderStatus(orderId, 'CANCELLED');
      toast.success('Order cancelled.');
      fetchOrders();
    } catch {
      toast.error('Failed to cancel order.');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderApi.updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${ORDER_STATUS_LABELS[status]}.`);
      fetchOrders();
    } catch {
      toast.error('Failed to update order status.');
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-page__header">
        <h1>My Orders</h1>
        <Link to="/browse" className="btn btn--primary btn--sm">
          Browse Food <ArrowRight size={16} />
        </Link>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      {loading ? (
        <SkeletonList count={4} />
      ) : orders.length > 0 ? (
        <>
          <div className="orders-page__list">
            {orders.map((order) => {
              const statusStyle = ORDER_STATUS_COLORS[order.status] || ORDER_STATUS_COLORS.PENDING;
              const food = order.foodItem;
              const isDonation = food?.listingType === 'DONATION';

              return (
                <div key={order.id} className="orders-page__item">
                  <div className="orders-page__item-thumb">
                    <span className="orders-page__item-emoji">
                      {getFoodTypeIcon(food?.foodType)}
                    </span>
                  </div>

                  <div className="orders-page__item-info">
                    <div className="orders-page__item-title-row">
                      <Link to={`/food/${food?.id}`} className="orders-page__item-title">
                        {food?.title || 'Food Item'}
                      </Link>
                      <Badge color={statusStyle.text} bg={statusStyle.bg}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </Badge>
                    </div>

                    <div className="orders-page__item-meta">
                      <span className="orders-page__item-price">
                        {isDonation ? 'FREE' : `${CURRENCY_SYMBOL}${order.totalAmount}`}
                      </span>
                      <span>{order.quantity} {getUnitLabel(food?.unit)}</span>
                      {!isDonation && order.unitPrice && (
                        <span>@ {CURRENCY_SYMBOL}{order.unitPrice}/{getUnitLabel(food?.unit)}</span>
                      )}
                    </div>

                    {food?.pickupAddress && (
                      <div className="orders-page__item-address">
                        Pickup: {food.pickupAddress.length > 50
                          ? food.pickupAddress.substring(0, 50) + '…'
                          : food.pickupAddress}
                      </div>
                    )}

                    <div className="orders-page__item-date">
                      Ordered {formatDate(order.createdAt || order.id)}
                    </div>
                  </div>

                  <div className="orders-page__item-actions">
                    <Link to={`/food/${food?.id}`} className="btn btn--ghost btn--sm">
                      View
                    </Link>

                    {order.status === 'PENDING' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                        >
                          Confirm
                        </Button>
                        <button
                          className="btn btn--ghost btn--sm orders-page__cancel-btn"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'READY_FOR_PICKUP')}
                      >
                        Ready
                      </Button>
                    )}

                    {order.status === 'READY_FOR_PICKUP' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="orders-page__pagination">
              <button
                className="btn btn--ghost btn--sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="orders-page__page-info">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn btn--ghost btn--sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="When you claim or purchase food, your orders will appear here."
          actionLabel="Browse Food"
          onAction={() => window.location.href = '/browse'}
        />
      )}
    </div>
  );
}
