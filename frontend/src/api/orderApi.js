import apiClient, { unwrapOrThrow } from './client';

/**
 * Build query params with proper prefix nesting for Spring Boot @ModelAttribute binding.
 */
function buildParams(filter = {}, pageable = {}) {
  const params = {};

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params[`filter.${key}`] = value;
    }
  });

  Object.entries(pageable).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params[`pageable.${key}`] = value;
    }
  });

  return params;
}

const orderApi = {
  /**
   * POST /api/order
   * Body: { foodItemId, quantity }
   */
  createOrder: async (foodItemId, quantity) => {
    const response = await apiClient.post('/order', { foodItemId, quantity });
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/order
   * Query params: filter (OrderSearchFilter) + pageable (Pageable)
   */
  getOrders: async (filter = {}, pageable = { page: 0, size: 10 }) => {
    const params = buildParams(filter, pageable);
    const response = await apiClient.get('/order', { params });
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/order/{orderId}
   */
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/order/${orderId}`);
    return unwrapOrThrow(response);
  },

  /**
   * PATCH /api/order/{orderId}/status
   * Body: { status }
   */
  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.patch(`/order/${orderId}/status`, { status });
    return unwrapOrThrow(response);
  },
};

export default orderApi;
