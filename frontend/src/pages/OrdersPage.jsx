import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, Truck, Clock, CheckCircle, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import orderApi from '../api/orderApi';
import ratingApi from '../api/ratingApi';
import pickupApi from '../api/pickupApi';
import Tabs from '../components/common/Tabs';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import StarRating from '../components/common/StarRating';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { CURRENCY_SYMBOL, getUnitLabel, getFoodTypeIcon } from '../utils/constants';
import { formatDate } from '../utils/formatters';
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

  // Rating modal
  const [ratingModal, setRatingModal] = useState({ open: false, order: null });
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratedOrders, setRatedOrders] = useState(new Set());

  // Pickup modal
  const [pickupModal, setPickupModal] = useState({ open: false, order: null });
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupLoading, setPickupLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const filter = {};
      if (activeTab) filter.status = activeTab;

      const result = await orderApi.getOrders(filter, { page, size: 10 });
      const content = result?.content || [];
      setOrders(content);
      setTotalPages(result?.totalPages || 1);
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

  // Rating handlers
  const openRatingModal = (order) => {
    setRatingModal({ open: true, order });
    setRatingValue(0);
    setRatingComment('');
  };

  const closeRatingModal = () => {
    setRatingModal({ open: false, order: null });
    setRatingValue(0);
    setRatingComment('');
  };

  const handleSubmitRating = async () => {
    if (ratingValue < 1 || ratingValue > 5) {
      toast.error('Please select a rating between 1 and 5.');
      return;
    }

    setRatingLoading(true);
    try {
      await ratingApi.postRating({
        orderId: ratingModal.order.id,
        ratingValue,
        comment: ratingComment || '',
      });
      toast.success('Rating submitted! Thank you.');
      setRatedOrders((prev) => new Set(prev).add(ratingModal.order.id));
      closeRatingModal();
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to submit rating.');
    } finally {
      setRatingLoading(false);
    }
  };

  // Pickup handlers
  const openPickupModal = (order) => {
    setPickupModal({ open: true, order });
    setPickupDate('');
    setPickupTime('');
  };

  const closePickupModal = () => {
    setPickupModal({ open: false, order: null });
    setPickupDate('');
    setPickupTime('');
  };

  const handleSchedulePickup = async () => {
    if (!pickupDate || !pickupTime) {
      toast.error('Please select a date and time for pickup.');
      return;
    }

    const scheduledTime = `${pickupDate}T${pickupTime}:00`;

    setPickupLoading(true);
    try {
      await pickupApi.createPickup(pickupModal.order.id, scheduledTime);
      toast.success('Pickup scheduled successfully!');
      closePickupModal();
    } catch (err) {
      toast.error(err.message || 'Failed to schedule pickup.');
    } finally {
      setPickupLoading(false);
    }
  };

  const orderCounts = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  return (
    <div className="orders-page">
      <div className="orders-page__header">
        <div>
          <h1>My Orders</h1>
          <p className="orders-page__subtitle">
            Track and manage your food orders
          </p>
        </div>
        <Link to="/browse" className="btn btn--primary btn--sm">
          Browse Food <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats Summary */}
      {!loading && orders.length > 0 && (
        <div className="orders-page__stats">
          <div className="orders-page__stat">
            <ShoppingBag size={16} color="var(--color-primary)" />
            <span className="orders-page__stat-value">{orders.length}</span>
            <span className="orders-page__stat-label">Total</span>
          </div>
          <div className="orders-page__stat">
            <Clock size={16} color="var(--color-warning)" />
            <span className="orders-page__stat-value">{orderCounts.PENDING || 0}</span>
            <span className="orders-page__stat-label">Pending</span>
          </div>
          <div className="orders-page__stat">
            <Truck size={16} color="var(--color-info)" />
            <span className="orders-page__stat-value">{(orderCounts.CONFIRMED || 0) + (orderCounts.READY_FOR_PICKUP || 0)}</span>
            <span className="orders-page__stat-label">In Progress</span>
          </div>
          <div className="orders-page__stat">
            <CheckCircle size={16} color="var(--color-success)" />
            <span className="orders-page__stat-value">{orderCounts.COMPLETED || 0}</span>
            <span className="orders-page__stat-label">Completed</span>
          </div>
        </div>
      )}

      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      {loading ? (
        <SkeletonList count={4} />
      ) : orders.length > 0 ? (
        <>
          <div className="orders-page__list">
            {orders.map((order, index) => {
              const statusStyle = ORDER_STATUS_COLORS[order.status] || ORDER_STATUS_COLORS.PENDING;
              const statusKey = (order.status || '').toLowerCase();
              const food = order.foodItem;
              const isDonation = food?.listingType === 'DONATION';

              return (
                <div
                  key={order.id}
                  className={`orders-page__item orders-page__item--${statusKey}`}
                  style={{ '--index': index }}
                >
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
                      {isDonation && (
                        <span className="orders-page__donation-badge">FREE</span>
                      )}
                    </div>

                    <div className="orders-page__item-meta">
                      <span className="orders-page__item-price">
                        {isDonation ? 'Free donation' : `${CURRENCY_SYMBOL}${order.totalAmount}`}
                      </span>
                      <span className="orders-page__meta-sep">·</span>
                      <span>{order.quantity} {getUnitLabel(food?.unit)}</span>
                      {!isDonation && order.unitPrice && (
                        <>
                          <span className="orders-page__meta-sep">·</span>
                          <span>@ {CURRENCY_SYMBOL}{order.unitPrice}/{getUnitLabel(food?.unit)}</span>
                        </>
                      )}
                    </div>

                    {food?.pickupAddress && (
                      <div className="orders-page__item-address">
                        <MapPin size={11} />
                        {food.pickupAddress.length > 50
                          ? food.pickupAddress.substring(0, 50) + '…'
                          : food.pickupAddress}
                      </div>
                    )}

                    <div className="orders-page__item-date">
                      Ordered {formatDate(order.createdAt || order.id)}
                    </div>
                  </div>

                  <div className="orders-page__item-actions">
                    <Link to={`/food/${food?.id}`} className="btn btn--sm orders-page__view-btn">
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
                          className="btn btn--sm orders-page__cancel-btn"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Truck}
                          onClick={() => openPickupModal(order)}
                        >
                          Pickup
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'READY_FOR_PICKUP')}
                        >
                          Ready
                        </Button>
                      </>
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

                    {order.status === 'COMPLETED' && !ratedOrders.has(order.id) && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Star}
                        onClick={() => openRatingModal(order)}
                      >
                        Rate
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

      {/* Rating Modal */}
      <Modal
        isOpen={ratingModal.open}
        onClose={closeRatingModal}
        title="Rate Your Experience"
        maxWidth="420px"
      >
        <div className="orders-page__rating-modal">
          {ratingModal.order && (
            <p className="orders-page__rating-food">
              {getFoodTypeIcon(ratingModal.order.foodItem?.foodType)}{' '}
              {ratingModal.order.foodItem?.title || 'Food Item'}
            </p>
          )}

          <div className="orders-page__rating-stars">
            <StarRating
              rating={ratingValue}
              onChange={setRatingValue}
              size={32}
            />
          </div>

          <div className="orders-page__rating-input">
            <label className="input-label">Comment (optional)</label>
            <textarea
              className="input input--textarea"
              rows={3}
              placeholder="Tell us about your experience..."
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              maxLength={500}
            />
          </div>

          <div className="orders-page__rating-actions">
            <Button variant="ghost" onClick={closeRatingModal}>
              Cancel
            </Button>
            <Button
              loading={ratingLoading}
              disabled={ratingValue < 1}
              onClick={handleSubmitRating}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pickup Modal */}
      <Modal
        isOpen={pickupModal.open}
        onClose={closePickupModal}
        title="Schedule Pickup"
        maxWidth="420px"
      >
        <div className="orders-page__pickup-modal">
          {pickupModal.order && (
            <p className="orders-page__pickup-food">
              {getFoodTypeIcon(pickupModal.order.foodItem?.foodType)}{' '}
              {pickupModal.order.foodItem?.title || 'Food Item'}
            </p>
          )}

          {pickupModal.order?.foodItem?.pickupAddress && (
            <div className="orders-page__pickup-address">
              📍 {pickupModal.order.foodItem.pickupAddress}
            </div>
          )}

          <div className="orders-page__pickup-form">
            <Input
              label="Pickup Date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <Input
              label="Pickup Time"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
            />
          </div>

          <div className="orders-page__pickup-actions">
            <Button variant="ghost" onClick={closePickupModal}>
              Cancel
            </Button>
            <Button
              loading={pickupLoading}
              disabled={!pickupDate || !pickupTime}
              onClick={handleSchedulePickup}
            >
              Schedule Pickup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
