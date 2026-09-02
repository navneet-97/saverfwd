import apiClient, { unwrapOrThrow } from './client';

const messageApi = {
  /**
   * POST /api/message
   * Body: { chatId, content }
   */
  sendMessage: async (chatId, content) => {
    const response = await apiClient.post('/message', { chatId, content });
    return unwrapOrThrow(response);
  },

  /**
   * GET /api/message/{messageId}
   */
  getMessage: async (messageId) => {
    const response = await apiClient.get(`/message/${messageId}`);
    return unwrapOrThrow(response);
  },

  /**
   * PATCH /api/message/{messageId}?content=...
   */
  updateMessage: async (messageId, content) => {
    const response = await apiClient.patch(`/message/${messageId}`, null, {
      params: { content },
    });
    return unwrapOrThrow(response);
  },

  /**
   * PATCH /api/message/{messageId}/read
   */
  markAsRead: async (messageId) => {
    const response = await apiClient.patch(`/message/${messageId}/read`);
    return unwrapOrThrow(response);
  },

  /**
   * DELETE /api/message/{messageId}
   */
  deleteMessage: async (messageId) => {
    const response = await apiClient.delete(`/message/${messageId}`);
    return unwrapOrThrow(response);
  },
};

export default messageApi;
