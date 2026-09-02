import apiClient, { unwrapOrThrow } from './client';

const chatApi = {
  /**
   * POST /api/chat/{userId}
   * Create a chat with another user
   */
  createChat: async (userId) => {
    const response = await apiClient.post(`/chat/${userId}`);
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/chat/{chatId}
   * Get chat by ID
   */
  getChatById: async (chatId) => {
    const response = await apiClient.get(`/chat/${chatId}`);
    return unwrapOrThrow(response);
  },
};

export default chatApi;
