import apiClient from './client';

const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),

  register: (data) => apiClient.post('/auth/register', data),

  logout: () => apiClient.post('/auth/logout'),

  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),

  refreshToken: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),

  getCurrentUser: () => apiClient.get('/auth/me'),
};

export default authApi;
