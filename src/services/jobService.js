import axios from 'axios';

// VITE_API_URL is base URL without /api, so we add it here
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${baseURL}/api`;

// Get job statistics
export const getJobStats = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/jobs/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get all job positions (staff only)
export const getAllJobs = async (page = 1, limit = 20, filters = {}) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const response = await axios.get(`${API_URL}/jobs?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get public job positions (anyone can view)
export const getPublicJobs = async (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const response = await axios.get(`${API_URL}/jobs/public?${params}`);
  return response.data;
};

// Get single job by ID (staff only)
export const getJobById = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/jobs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get public job by ID
export const getPublicJobById = async (id) => {
  const response = await axios.get(`${API_URL}/jobs/public/${id}`);
  return response.data;
};

// Create new job position
export const createJob = async (jobData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/jobs`, jobData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update job position
export const updateJob = async (id, jobData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/jobs/${id}`, jobData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Delete job position
export const deleteJob = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/jobs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default {
  getJobStats,
  getAllJobs,
  getPublicJobs,
  getJobById,
  getPublicJobById,
  createJob,
  updateJob,
  deleteJob
};
