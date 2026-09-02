import apiClient, { unwrapOrThrow } from './client';
import { buildParams } from '../utils/apiHelpers';

const foodApi = {
  /**
   * GET /api/food
   * Query params: filter (FoodFilterRequest) + pageable (Pageable)
   */
  getListings: async (filter = {}, pageable = { page: 0, size: 12 }) => {
    const params = buildParams(filter, pageable);
    const response = await apiClient.get('/food', { params });
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/food/{id}
   */
  getListing: async (id) => {
    const response = await apiClient.get(`/food/${id}`);
    return unwrapOrThrow(response);
  },

  /**
   * POST /api/food
   * Body: CreateFoodRequest
   */
  createListing: async (data) => {
    const response = await apiClient.post('/food', data);
    return unwrapOrThrow(response);
  },

  /**
   * PUT /api/food/{id}
   * Body: CreateFoodRequest
   */
  updateListing: async (id, data) => {
    const response = await apiClient.put(`/food/${id}`, data);
    return unwrapOrThrow(response);
  },

  /**
   * PATCH /api/food/{id}/status
   * Body: UpdateFoodStatusRequest { foodStatus }
   */
  updateStatus: async (id, foodStatus) => {
    const response = await apiClient.patch(`/food/${id}/status`, { foodStatus });
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/food/my-listings
   * Query params: pageable only (no filter support on backend)
   */
  getMyListings: async (pageable = { page: 0, size: 20 }) => {
    const params = {};
    Object.entries(pageable).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[`pageable.${key}`] = value;
      }
    });
    const response = await apiClient.get('/food/my-listings', { params });
    return unwrapOrThrow(response);
  },

  /**
   * POST /api/food/bulk
   * Body: CreateFoodRequest[]
   */
  createBulk: async (items) => {
    const response = await apiClient.post('/food/bulk', items);
    return unwrapOrThrow(response);
  },
};

export default foodApi;
