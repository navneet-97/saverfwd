import apiClient from './client';

const orderApi = {
  claimFood: (foodId, data) => apiClient.post(`/food/${foodId}/claim`, data),

  purchaseFood: (foodId, data) => apiClient.post(`/food/${foodId}/purchase`, data),

  getMyOrders: (params) => apiClient.get('/orders', { params }),

  getOrder: (id) => apiClient.get(`/orders/${id}`),

  confirmOrder: (id) => apiClient.put(`/orders/${id}/confirm`),

  cancelOrder: (id, reason) => apiClient.put(`/orders/${id}/cancel`, { reason }),

  completeOrder: (id) => apiClient.put(`/orders/${id}/complete`),

  markPickedUp: (id) => apiClient.put(`/orders/${id}/pickup`),
};

export default orderApi;
