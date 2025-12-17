import axios from 'axios';

// Set the base URL for all axios requests to the backend API
// VITE_API_URL should be base URL only (e.g., https://doqi-backend.vercel.app)
// We add /api here since all routes are under /api
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = `${baseURL}/api`;

// Add token to requests if user is logged in
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
