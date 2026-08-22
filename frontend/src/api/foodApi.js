import apiClient from './client';

const foodApi = {
  getListings: (params) => apiClient.get('/food', { params }),

  getListing: (id) => apiClient.get(`/food/${id}`),

  createListing: (data) => {
    const isFormData = data instanceof FormData;
    return apiClient.post('/food', data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' },
    } : {});
  },

  updateListing: (id, data) => {
    const isFormData = data instanceof FormData;
    return apiClient.put(`/food/${id}`, data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' },
    } : {});
  },

  deleteListing: (id) => apiClient.delete(`/food/${id}`),

  getMyListings: (params) => apiClient.get('/food/my', { params }),

  searchListings: (query, params) =>
    apiClient.get('/food/search', { params: { q: query, ...params } }),

  getNearbyListings: (lat, lng, radius) =>
    apiClient.get('/food/nearby', { params: { lat, lng, radius } }),

  getRecommendedListings: () => apiClient.get('/food/recommended'),
};

export default foodApi;
