import apiClient, { unwrapOrThrow } from './client';

const pickupApi = {
  /**
   * POST /api/pickup
   * Body: { orderId, scheduledTime }
   */
  createPickup: async (orderId, scheduledTime) => {
    const response = await apiClient.post('/pickup', { orderId, scheduledTime });
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/pickup/{pickupId}
   */
  getPickup: async (pickupId) => {
    const response = await apiClient.get(`/pickup/${pickupId}`);
    return unwrapOrThrow(response);
  },

  /**
   * PATCH /api/pickup/{pickupId}
   * Body: { pickedUpAt, status, pickupNotes }
   */
  updatePickup: async (pickupId, data) => {
    const response = await apiClient.patch(`/pickup/${pickupId}`, data);
    return unwrapOrThrow(response);
  },

  /**
   * DELETE /api/pickup/{pickupId}
   */
  deletePickup: async (pickupId) => {
    const response = await apiClient.delete(`/pickup/${pickupId}`);
    return unwrapOrThrow(response);
  },
};

export default pickupApi;
