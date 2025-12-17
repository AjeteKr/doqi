import axios from 'axios';

// VITE_API_URL is base URL without /api, so we add it here
const baseURL = import.meta.env.VITE_API_URL;
const API_URL = `${baseURL}/api/admin`;

// Get authorization headers with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Get user statistics for dashboard
export const getUserStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/stats`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all users with pagination and filters
export const getUsers = async (params = {}) => {
  try {
    const { page = 1, limit = 10, role, active, search } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    if (role !== undefined) queryParams.append('role', role);
    if (active !== undefined) queryParams.append('active', active);
    if (search) queryParams.append('search', search);
    
    const response = await axios.get(`${API_URL}/users?${queryParams}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user active status (suspend/activate)
export const updateUserStatus = async (userId, active) => {
  try {
    const response = await axios.patch(
      `${API_URL}/users/${userId}/status`,
      { active },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId, roleId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/users/${userId}/role`,
      { role_id: roleId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user (soft delete via suspension)
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get recent activity
export const getRecentActivity = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/activity?limit=${limit}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};
