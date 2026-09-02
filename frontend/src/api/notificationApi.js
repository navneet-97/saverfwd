import apiClient, { unwrapOrThrow } from './client';
import { buildParams } from '../utils/apiHelpers';

const notificationApi = {
  /**
   * POST /api/notification
   * Body: CreateNotificationRequest
   */
  createNotification: async (data) => {
    const response = await apiClient.post('/notification', data);
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/notification/{notificationId}
   */
  getNotification: async (notificationId) => {
    const response = await apiClient.get(`/notification/${notificationId}`);
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/notification
   * Query params: filter (NotificationSearchFilter) + pageable
   */
  getNotifications: async (filter = {}, pageable = { page: 0, size: 20 }) => {
    const params = buildParams(filter, pageable);
    const response = await apiClient.get('/notification', { params });
    return unwrapOrThrow(response);
  },

  /**
   * PATCH /api/notification/{notificationId}/read
   */
  markAsRead: async (notificationId) => {
    const response = await apiClient.patch(`/notification/${notificationId}/read`);
    return unwrapOrThrow(response);
  },

  /**
   * DELETE /api/notification/{notificationId}
   */
  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(`/notification/${notificationId}`);
    return unwrapOrThrow(response);
  },
};

export default notificationApi;
