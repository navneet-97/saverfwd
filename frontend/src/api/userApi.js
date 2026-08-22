import apiClient, { unwrapOrThrow } from './client';

/**
 * Build query params with proper prefix nesting for Spring Boot @ModelAttribute binding.
 * Backend expects: ?filter.email=xyz&pageable.page=0&pageable.size=12
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
