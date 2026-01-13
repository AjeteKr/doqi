import axios from '../api';

// Get product statistics
export const getProductStats = async () => {
  const response = await axios.get('/admin/products/stats');
  return response.data;
};

// Get all products with pagination and filters
export const getAllProducts = async (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const response = await axios.get(`/admin/products?${params}`);
  return response.data;
};

// Get single product by ID
export const getProductById = async (id) => {
  const response = await axios.get(`/admin/products/${id}`);
  return response.data;
};

// Create new product
export const createProduct = async (productData) => {
  const response = await axios.post(`/admin/products`, productData);
  return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const response = await axios.put(`/admin/products/${id}`, productData);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await axios.delete(`/admin/products/${id}`);
  return response.data;
};

// Upload product image
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axios.post(`/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete product image
export const deleteImage = async (filename) => {
  const response = await axios.delete(`/upload/${filename}`);
  return response.data;
};

// PUBLIC API - Get all products (filtered by premium status based on auth)
export const getPublicProducts = async (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  const response = await axios.get(`/products?${params}`);
  return response.data;
};

// PUBLIC API - Get single product by ID (checks premium status)
export const getPublicProductById = async (id) => {
  const response = await axios.get(`/products/${id}`);
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
