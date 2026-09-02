import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, Check, Trash2, ShoppingBag, Star,
  Clock, AlertTriangle, Info, CheckCircle, XCircle,
} from 'lucide-react';
import notificationApi from '../api/notificationApi';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { timeAgo } from '../utils/formatters';
import './NotificationsPage.css';

const NOTIFICATION_CONFIG = {
  ORDER_CONFIRMED: { icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
  ORDER_READY_FOR_PICKUP: { icon: Clock, color: '#2563eb', bg: '#eff6ff' },
  ORDER_COMPLETED: { icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
  ORDER_CANCELLED: { icon: XCircle, color: '#dc2626', bg: '#fef2f2' },
  NEW_ORDER_RECEIVED: { icon: ShoppingBag, color: '#f97316', bg: '#fff7ed' },
  FOOD_LISTING_EXPIRING: { icon: AlertTriangle, color: '#d97706', bg: '#fffbeb' },
  FOOD_LISTING_EXPIRED: { icon: Clock, color: '#6b7280', bg: '#f3f4f6' },
  NEW_RATING_RECEIVED: { icon: Star, color: '#eab308', bg: '#fefce8' },
  PICKUP_REMINDER: { icon: Bell, color: '#7c3aed', bg: '#ede9fe' },
  SYSTEM: { icon: Info, color: '#6b7280', bg: '#f3f4f6' },
};

function getNotificationLink(notification) {
  if (!notification.referenceId) return null;
  const type = notification.notificationType;
  if (type?.startsWith('ORDER_') || type === 'NEW_ORDER_RECEIVED' || type === 'PICKUP_REMINDER') {
    return `/orders`;
  }
  if (type?.startsWith('FOOD_')) {
    return `/food/${notification.referenceId}`;
  }
  return null;
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilter = {};
      if (filter === 'unread') apiFilter.isRead = false;
      if (filter === 'read') apiFilter.isRead = true;

      const result = await notificationApi.getNotifications(apiFilter, {
        page,
        size: 20,
      });
      setNotifications(result?.content || []);
      setTotalPages(result?.totalPages || 1);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      toast.error('Failed to mark notification as read.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted.');
    } catch {
      toast.error('Failed to delete notification.');
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((n) => notificationApi.markAsRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read.');
    } catch {
      toast.error('Failed to mark all as read.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications">
      <div className="notifications__header">
        <div>
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="notifications__unread-badge">{unreadCount} unread</span>
          )}
        </div>
        <div className="notifications__actions">
          {unreadCount > 0 && (
            <button className="btn btn--ghost btn--sm" onClick={handleMarkAllRead}>
              <Check size={16} /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="notifications__filters">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            className={`notifications__filter-btn ${filter === f ? 'notifications__filter-btn--active' : ''}`}
            onClick={() => { setFilter(f); setPage(0); }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : notifications.length > 0 ? (
        <div className="notifications__list">
          {notifications.map((notification) => {
            const config = NOTIFICATION_CONFIG[notification.notificationType] || NOTIFICATION_CONFIG.SYSTEM;
            const Icon = config.icon;
            const link = getNotificationLink(notification);

            return (
              <div
                key={notification.id}
                className={`notifications__item ${!notification.isRead ? 'notifications__item--unread' : ''}`}
              >
                <div className="notifications__item-icon" style={{ background: config.bg, color: config.color }}>
                  <Icon size={20} />
                </div>
                <div className="notifications__item-content">
                  <div className="notifications__item-title">
                    {notification.title}
                    {!notification.isRead && <span className="notifications__item-dot" />}
                  </div>
                  <p className="notifications__item-message">{notification.message}</p>
                  <span className="notifications__item-time">{timeAgo(notification.createdAt)}</span>
                </div>
                <div className="notifications__item-actions">
                  {link && (
                    <Link to={link} className="btn btn--ghost btn--sm">
                      View
                    </Link>
                  )}
                  {!notification.isRead && (
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    className="btn btn--ghost btn--sm btn--danger"
                    onClick={() => handleDelete(notification.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title={filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
          description={
            filter === 'all'
              ? "You'll be notified about your listings, orders, and pickups."
              : `No ${filter} notifications to show.`
          }
        />
      )}

      {totalPages > 1 && (
        <div className="notifications__pagination">
          <button
            className="btn btn--ghost btn--sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="notifications__page-info">
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
    </div>
  );
}
