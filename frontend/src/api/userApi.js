import apiClient from './client';

const userApi = {
  getProfile: () => apiClient.get('/users/profile'),

  getPublicProfile: (userId) => apiClient.get(`/users/${userId}`),

  updateProfile: (data) => apiClient.put('/users/profile', data),

  updateProfilePicture: (formData) =>
    apiClient.post('/users/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getStats: () => apiClient.get('/users/stats'),
};

export default userApi;
