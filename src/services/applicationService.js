import axios from '../api';

// Check if user already applied for a job
export const checkIfApplied = async (jobId) => {
  if (!localStorage.getItem('token')) return { hasApplied: false };
  
  try {
    const response = await axios.get(`/applications/check/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking application status:', error);
    return { hasApplied: false };
  }
};

// Apply for a job position
export const applyForJob = async (formData) => {
  const response = await axios.post(`/applications`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Get user's applications
export const getUserApplications = async () => {
  const response = await axios.get(`/applications/my-applications`);
  return response.data;
};

// Get all applications (staff only)
export const getAllApplications = async (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const response = await axios.get(`/applications?${params}`);
  return response.data;
};

// Get application by ID (staff only)
export const getApplicationById = async (id) => {
  const response = await axios.get(`/applications/${id}`);
  return response.data;
};

// Update application status (staff only)
export const updateApplicationStatus = async (id, status, notes = '') => {
  const response = await axios.put(`/applications/${id}/status`, 
    { status, notes }
  );
  return response.data;
};

// Get application statistics (staff only)
export const getApplicationStats = async () => {
  const response = await axios.get(`/applications/stats`);
  return response.data;
};

// Download CV (staff only)
export const downloadCV = async (id) => {
  const response = await axios.get(`/applications/${id}/cv`, {
    responseType: 'blob'
  });
  return response.data;
};

export default {
  applyForJob,
  checkIfApplied,
  getUserApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationStats,
  downloadCV
};
