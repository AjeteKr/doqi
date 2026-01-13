import axios from '../api';

// Get user statistics for dashboard
export const getUserStats = async () => {
  try {
    const response = await axios.get(`/admin/users/stats`);
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
    
    const response = await axios.get(`/admin/users?${queryParams}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user active status (suspend/activate)
export const updateUserStatus = async (userId, active) => {
  try {
    const response = await axios.patch(
      `/admin/users/${userId}/status`,
      { active }
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
      `/admin/users/${userId}/role`,
      { role_id: roleId }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete user (soft delete via suspension)
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get recent activity
export const getRecentActivity = async (limit = 10) => {
  try {
    const response = await axios.get(`/admin/activity?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
