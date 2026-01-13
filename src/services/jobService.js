import axios from '../api';

// Get job statistics
export const getJobStats = async () => {
  const response = await axios.get(`/jobs/stats`);
  return response.data;
};

// Get all job positions (staff only)
export const getAllJobs = async (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const response = await axios.get(`/jobs?${params}`);
  return response.data;
};

// Get public job positions (anyone can view)
export const getPublicJobs = async (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const response = await axios.get(`/jobs/public?${params}`);
  return response.data;
};

// Get single job by ID (staff only)
export const getJobById = async (id) => {
  const response = await axios.get(`/jobs/${id}`);
  return response.data;
};

// Get public job by ID
export const getPublicJobById = async (id) => {
  const response = await axios.get(`/jobs/public/${id}`);
  return response.data;
};

// Create new job position
export const createJob = async (jobData) => {
  const response = await axios.post(`/jobs`, jobData);
  return response.data;
};

// Update job position
export const updateJob = async (id, jobData) => {
  const response = await axios.put(`/jobs/${id}`, jobData);
  return response.data;
};

// Delete job position
export const deleteJob = async (id) => {
  const response = await axios.delete(`/jobs/${id}`);
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
