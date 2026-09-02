import apiClient, { unwrapOrThrow } from './client';
import { buildParams } from '../utils/apiHelpers';

const ratingApi = {
  /**
   * POST /api/rating
   * Body: { orderId, ratingValue, comment }
   */
  postRating: async (data) => {
    const response = await apiClient.post('/rating', data);
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/rating
   * Query params: filter (RatingSearchFilter) + pageable
   */
  getRatings: async (filter = {}, pageable = { page: 0, size: 10 }) => {
    const params = buildParams(filter, pageable);
    const response = await apiClient.get('/rating', { params });
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/rating/{ratingId}
   */
  getRatingById: async (ratingId) => {
    const response = await apiClient.get(`/rating/${ratingId}`);
    return unwrapOrThrow(response);
  },

  /**
   * PATCH /api/rating/{ratingId}
   * Body: { ratingValue, comment }
   */
  updateRating: async (ratingId, data) => {
    const response = await apiClient.patch(`/rating/${ratingId}`, data);
    return unwrapOrThrow(response);
  },

  /**
   * DELETE /api/rating/{ratingId}
   */
  deleteRating: async (ratingId) => {
    const response = await apiClient.delete(`/rating/${ratingId}`);
    return unwrapOrThrow(response);
  },
};

export default ratingApi;
