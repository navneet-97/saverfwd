import apiClient, { unwrapOrThrow } from './client';

const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    // AuthResponse has { success, message, data: UserResponse, tokens: TokenResponse }
    // We need the full body (not just data) because tokens is a sibling of data
    const body = response.data;
    if (body?.success === false) {
      const error = new Error(body.message || 'Login failed');
      error.data = body;
      throw error;
    }
    return body;
  },

  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    const body = response.data;
    if (body?.success === false) {
      const error = new Error(body.message || 'Registration failed');
      error.data = body;
      throw error;
    }
    return body;
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
