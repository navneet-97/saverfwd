import apiClient from './client';

const chatApi = {
  getConversations: () => apiClient.get('/chat/conversations'),

  getMessages: (conversationId, params) =>
    apiClient.get(`/chat/conversations/${conversationId}/messages`, { params }),

  sendMessage: (conversationId, data) =>
    apiClient.post(`/chat/conversations/${conversationId}/messages`, data),

  startConversation: (data) => apiClient.post('/chat/conversations', data),

  markConversationRead: (conversationId) =>
    apiClient.put(`/chat/conversations/${conversationId}/read`),
};

export default chatApi;
