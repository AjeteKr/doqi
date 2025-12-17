import api from '../api';

const contactService = {
  // Submit a contact message (public)
  submitMessage: async (messageData) => {
    const response = await api.post('/contact', messageData);
    return response.data;
  },

  // Get all contact messages (staff/admin only)
  getAllMessages: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/contact?${params.toString()}`);
    return response.data;
  },

  // Get message statistics (staff/admin only)
  getStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data;
  },

  // Get a single message by ID (staff/admin only)
  getMessageById: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  // Update message status (staff/admin only)
  updateStatus: async (id, status) => {
    const response = await api.patch(`/contact/${id}/status`, { status });
    return response.data;
  },

  // Delete a message (admin only)
  deleteMessage: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  }
};

export default contactService;
