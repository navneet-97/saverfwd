import apiClient, { unwrapOrThrow } from './client';

const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return unwrapOrThrow(response);
  },

  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return unwrapOrThrow(response);
  },

  logout: async (refreshToken) => {
    const response = await apiClient.post('/auth/logout', { refreshToken });
    return unwrapOrThrow(response);
  },

  logoutAll: async () => {
    const response = await apiClient.post('/auth/logout-all');
    return unwrapOrThrow(response);
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return unwrapOrThrow(response);
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return unwrapOrThrow(response);
  },
};

export default authApi;
