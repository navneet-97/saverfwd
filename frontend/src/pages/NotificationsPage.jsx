import { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import notificationApi from '../api/notificationApi';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { timeAgo } from '../utils/formatters';
import './NotificationsPage.css';

const NOTIFICATION_ICONS = {
  CLAIMED: '🍽️',
  CONFIRMED: '✅',
  PICKUP: '📍',
  MESSAGE: '💬',
  EXPIRED: '⏰',
  CANCELLED: '❌',
  RATING: '⭐',
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationApi.getNotifications();
      setNotifications(Array.isArray(data) ? data : data.content || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error('Failed to mark notification as read.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read.');
    } catch {
      toast.error('Failed to mark all as read.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error('Failed to delete notification.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications">
      <div className="notifications__header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button className="notifications__mark-all" onClick={handleMarkAllRead}>
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : notifications.length > 0 ? (
        <div className="notifications__list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notifications__item ${!n.read ? 'notifications__item--unread' : ''}`}
            >
              <span className="notifications__item-icon">
                {NOTIFICATION_ICONS[n.type] || '🔔'}
              </span>
              <div className="notifications__item-content">
                <p className="notifications__item-message">{n.message || n.title}</p>
                {n.createdAt && (
                  <span className="notifications__item-time">{timeAgo(n.createdAt)}</span>
                )}
              </div>
              <div className="notifications__item-actions">
                {!n.read && (
                  <button
                    className="notifications__action-btn"
                    onClick={() => handleMarkRead(n.id)}
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button
                  className="notifications__action-btn notifications__action-btn--danger"
                  onClick={() => handleDelete(n.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
        />
      )}
    </div>
  );
}
