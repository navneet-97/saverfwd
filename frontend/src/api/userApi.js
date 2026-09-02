import apiClient, { unwrapOrThrow } from './client';
import { buildParams } from '../utils/apiHelpers';

const userApi = {
  /**
   * GET /api/users
   * Query params: filter (UserFilterRequest) + pageable (Pageable)
   */
  getUsers: async (filter = {}, pageable = { page: 0, size: 20 }) => {
    const params = buildParams(filter, pageable);
    const response = await apiClient.get('/users', { params });
    return unwrapOrThrow(response);
  },

  /**
   * DELETE /api/users/{userId}
   */
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return unwrapOrThrow(response);
  },
};

export default userApi;
