import apiClient from './client';

const ratingApi = {
  submitRating: (orderId, data) => apiClient.post(`/orders/${orderId}/rating`, data),

  getRatingsForUser: (userId, params) =>
    apiClient.get(`/ratings/user/${userId}`, { params }),

  getMyRatings: (params) => apiClient.get('/ratings/mine', { params }),
};

export default ratingApi;
