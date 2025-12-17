// Authentication API Service
import axios from '../api';

/**
 * Auth API Service
 * Centralized API calls for authentication and user management
 */

const authService = {
  /**
   * Login with email and password
   */
  login: async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (name, email, password) => {
    const response = await axios.post('/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (token) => {
    const response = await axios.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  /**
   * Update user profile (name)
   */
  updateProfile: async (name, token) => {
    const response = await axios.put('/auth/profile',
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  /**
   * Change user password
   */
  changePassword: async (currentPassword, newPassword, token) => {
    const response = await axios.put('/auth/change-password',
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token, newPassword) => {
    const response = await axios.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }
};

export default authService;
