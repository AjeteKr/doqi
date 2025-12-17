import axios from 'axios';

// VITE_API_URL is base URL without /api, so we add it here
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${baseURL}/api`;

// Check if user already applied for a job
export const checkIfApplied = async (jobId) => {
  const token = localStorage.getItem('token');
  if (!token) return { hasApplied: false };
  
  try {
    const response = await axios.get(`${API_URL}/applications/check/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking application status:', error);
    return { hasApplied: false };
  }
};

// Apply for a job position
export const applyForJob = async (formData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/applications`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Get user's applications
export const getUserApplications = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/applications/my-applications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get all applications (staff only)
export const getAllApplications = async (page = 1, limit = 20, filters = {}) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const response = await axios.get(`${API_URL}/applications?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get application by ID (staff only)
export const getApplicationById = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/applications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update application status (staff only)
export const updateApplicationStatus = async (id, status, notes = '') => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/applications/${id}/status`, 
    { status, notes },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

// Get application statistics (staff only)
export const getApplicationStats = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/applications/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Download CV (staff only)
export const downloadCV = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/applications/${id}/cv`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob'
  });
  return response.data;
};

export default {
  applyForJob,
  getUserApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationStats,
  downloadCV
};
