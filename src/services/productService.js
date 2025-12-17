import axios from 'axios';

// VITE_API_URL is base URL without /api, so we add it here
const baseURL = import.meta.env.VITE_API_URL;
const API_URL = `${baseURL}/api`;

// Get product statistics
export const getProductStats = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/admin/products/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get all products with pagination and filters
export const getAllProducts = async (page = 1, limit = 20, filters = {}) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const response = await axios.get(`${API_URL}/admin/products?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get single product by ID
export const getProductById = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/admin/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Create new product
export const createProduct = async (productData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/admin/products`, productData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/admin/products/${id}`, productData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/admin/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Upload product image
export const uploadImage = async (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete product image
export const deleteImage = async (filename) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/upload/${filename}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// PUBLIC API - Get all products (filtered by premium status based on auth)
export const getPublicProducts = async (page = 1, limit = 20, filters = {}) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }
  
  const response = await axios.get(`${API_URL}/products?${params}`, config);
  return response.data;
};

// PUBLIC API - Get single product by ID (checks premium status)
export const getPublicProductById = async (id) => {
  const token = localStorage.getItem('token');
  
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }
  
  const response = await axios.get(`${API_URL}/products/${id}`, config);
  return response.data;
};

export default {
  getProductStats,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
  getPublicProducts,
  getPublicProductById
};
