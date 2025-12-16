import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} from '../../services/productService';

export default function AdminProducts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 10;
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    origin: '',
    image: '',
    featured: false,
    inStock: true,
    premium: false,
    loginRequired: false,
    specifications: {
      size: '',
      thickness: '',
      material: '',
      color: '',
      finish: '',
      warranty: '',
      certification: '',
      density: '',
      grade: '',
      accuracy: '',
      turnaround: '',
      maxSize: '',
      firmness: '',
      height: '',
      additional: ''
    }
  });

  const categories = [
    'customerService',
    'mattress',
    'sofaChair',
    'mdfChipBoard',
    'compactHPL',
    'accessories'
  ];

  // Define subcategories for each category
  const categorySubcategories = {
    mattress: [
      'ecoFlex',
      'mediumFlex',
      'starFlex',
      'hotelLineConcept'
    ],
    customerService: [
      'cutting',
      'edgeBanding',
      'cnc'
    ],
    sofaChair: [
      'sofa',
      'chair'
    ],
    mdfChipBoard: [],
    compactHPL: [],
    accessories: []
  };

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 1) {
      navigate('/');
      return;
    }
    
    fetchProducts();
  }, [isAuthenticated, user, navigate, currentPage, searchTerm, categoryFilter, stockFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (categoryFilter) filters.category = categoryFilter;
      if (stockFilter) filters.inStock = stockFilter === 'true';
      
      const data = await getAllProducts(currentPage, limit, filters);
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
      setTotalProducts(data.pagination.total);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || t('admin.products.errors.loadFailed') });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    setCurrentProduct(product);
    
    if (mode === 'edit' && product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        origin: product.origin || '',
        image: product.image || '',
        featured: product.featured || false,
        inStock: product.inStock !== undefined ? product.inStock : true,
        premium: product.premium || false,
        loginRequired: product.login_required || false,
        specifications: product.specifications || {
          size: '',
          thickness: '',
          material: '',
          color: '',
          finish: '',
          warranty: '',
          certification: '',
          density: '',
          grade: '',
          accuracy: '',
          turnaround: '',
          maxSize: '',
          firmness: '',
          height: '',
          additional: ''
        }
      });
      setImagePreview(product.image || '');
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        origin: '',
        image: '',
        featured: false,
        inStock: true,
        premium: false,
        loginRequired: false,
        specifications: {
          size: '',
          thickness: '',
          material: '',
          color: '',
          finish: '',
          warranty: '',
          certification: '',
          density: '',
          grade: '',
          accuracy: '',
          turnaround: '',
          maxSize: '',
          firmness: '',
          height: '',
          additional: ''
        }
      });
      setImagePreview('');
    }
    
    setSelectedImage(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setSelectedImage(null);
    setImagePreview('');
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      subCategory: '',
      origin: '',
      image: '',
      featured: false,
      inStock: true,
      premium: false,
      loginRequired: false,
      specifications: {
        size: '',
        thickness: '',
        material: '',
        color: '',
        finish: '',
        warranty: '',
        certification: '',
        density: '',
        grade: '',
        accuracy: '',
        turnaround: '',
        maxSize: '',
        firmness: '',
        height: '',
        additional: ''
      }
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setToast({ type: 'error', message: t('admin.products.errors.invalidFileType') });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setToast({ type: 'error', message: t('admin.products.errors.fileTooLarge') });
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Check if this is a specification field
    if (name.startsWith('spec_')) {
      const specField = name.replace('spec_', '');
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      // If category is being changed, clear the subCategory
      if (name === 'category') {
        setFormData(prev => ({
          ...prev,
          category: value,
          subCategory: '' // Clear subcategory when category changes
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setToast({ type: 'error', message: t('admin.products.errors.titleRequired') });
      return;
    }

    try {
      let imageUrl = formData.image;
      
      // Upload image if a new one is selected
      if (selectedImage) {
        setUploading(true);
        const uploadResponse = await uploadImage(selectedImage);
        imageUrl = uploadResponse.path;
        setUploading(false);
      }
      
      const productData = {
        ...formData,
        image: imageUrl
      };
      
      if (modalMode === 'create') {
        await createProduct(productData);
        setToast({ type: 'success', message: t('admin.products.success.created') });
      } else {
        await updateProduct(currentProduct.id, productData);
        setToast({ type: 'success', message: t('admin.products.success.updated') });
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      setUploading(false);
      setToast({ type: 'error', message: err.response?.data?.message || t('admin.products.errors.operationFailed', { mode: modalMode }) });
    }
  };

  const handleDelete = async (product) => {
    setConfirmDialog({
      title: t('confirmDialog.deleteProduct.title'),
      message: t('confirmDialog.deleteProduct.message', { productTitle: product.title }),
      confirmText: t('confirmDialog.deleteProduct.confirmText'),
      cancelText: t('confirmDialog.deleteProduct.cancelText'),
      onConfirm: () => confirmDelete(product)
    });
  };

  const confirmDelete = async (product) => {
    try {
      await deleteProduct(product.id);
      setToast({ type: 'success', message: t('admin.products.success.deleted') });
      fetchProducts();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || t('admin.products.errors.deleteFailed') });
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.products.title')}</h1>
        <p className="text-gray-600 mt-2">{t('admin.products.subtitle')}</p>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type="danger"
        />
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            id="search-products"
            name="search"
            placeholder={t('admin.products.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          
          <select
            id="filter-category"
            name="categoryFilter"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">{t('admin.products.allCategories')}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            id="filter-stock"
            name="stockFilter"
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">{t('admin.products.allStockStatus')}</option>
            <option value="true">{t('products.inStock')}</option>
            <option value="false">{t('products.outOfStock')}</option>
          </select>
          
          <button
            onClick={() => handleOpenModal('create')}
            className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>{t('admin.products.addProduct')}</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {t('admin.products.showing', { count: products.length, total: totalProducts })}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.products.table.product')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.products.table.category')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.products.table.price')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.products.table.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.products.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-10 w-10 rounded object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      <div className="text-sm text-gray-500">{product.origin}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                  {product.subCategory && (
                    <div className="text-xs text-gray-400">{product.subCategory}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.price ? `€${product.price}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? t('products.inStock') : t('products.outOfStock')}
                    </span>
                    {product.featured && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {t('admin.products.featured')}
                      </span>
                    )}
                    {product.premium && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {t('products.premium')}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal('edit', product)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    {t('admin.products.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="text-red-600 hover:text-red-900"
                  >
                    {t('admin.products.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {t('products.noProducts')}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {t('admin.products.previous')}
          </button>
          
          <span className="text-sm text-gray-700">
            {t('admin.products.pageOf', { current: currentPage, total: totalPages })}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {t('admin.products.next')}
          </button>
        </div>
      )}

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {modalMode === 'create' ? t('admin.products.addNewProduct') : t('admin.products.editProduct')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="product-title" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.products.form.title')} *
                  </label>
                  <input
                    type="text"
                    id="product-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.products.form.description')}
                  </label>
                  <textarea
                    id="product-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.products.form.price')}
                    </label>
                    <input
                      type="number"
                      id="product-price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="product-origin" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.products.form.origin')}
                    </label>
                    <input
                      type="text"
                      id="product-origin"
                      name="origin"
                      value={formData.origin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Category and SubCategory - dynamic grid */}
                <div className={`grid gap-4 ${formData.category && categorySubcategories[formData.category]?.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <div>
                    <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.products.form.category')}
                    </label>
                    <select
                      id="product-category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">{t('admin.products.form.selectCategory')}</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{t(`products.categories.${cat}`)}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Only show subcategory if the selected category has subcategories */}
                  {formData.category && categorySubcategories[formData.category]?.length > 0 && (
                    <div>
                      <label htmlFor="product-subCategory" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.subCategory')}
                      </label>
                      <select
                        id="product-subCategory"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">{t('admin.products.form.selectSubCategory')}</option>
                        {categorySubcategories[formData.category].map(subCat => (
                          <option key={subCat} value={subCat}>
                            {t(`products.subCategories.${subCat}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="product-image" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.products.form.productImage')}
                  </label>
                  <input
                    type="file"
                    id="product-image"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageSelect}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('admin.products.form.imageRequirements')}
                  </p>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">{t('admin.products.form.preview')}:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded border border-gray-300"
                      />
                    </div>
                  )}
                </div>
                
                {/* Specifications Section */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.products.form.specifications.title')}</h3>
                  <p className="text-sm text-gray-600 mb-4">{t('admin.products.form.specifications.subtitle')}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="spec-size" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.size')}
                      </label>
                      <input
                        type="text"
                        id="spec-size"
                        name="spec_size"
                        value={formData.specifications.size}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.sizePlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-thickness" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.thickness')}
                      </label>
                      <input
                        type="text"
                        id="spec-thickness"
                        name="spec_thickness"
                        value={formData.specifications.thickness}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.thicknessPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-material" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.material')}
                      </label>
                      <input
                        type="text"
                        id="spec-material"
                        name="spec_material"
                        value={formData.specifications.material}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.materialPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-color" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.color')}
                      </label>
                      <input
                        type="text"
                        id="spec-color"
                        name="spec_color"
                        value={formData.specifications.color}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.colorPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-finish" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.finish')}
                      </label>
                      <input
                        type="text"
                        id="spec-finish"
                        name="spec_finish"
                        value={formData.specifications.finish}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.finishPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-warranty" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.warranty')}
                      </label>
                      <input
                        type="text"
                        id="spec-warranty"
                        name="spec_warranty"
                        value={formData.specifications.warranty}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.warrantyPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-certification" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.certification')}
                      </label>
                      <input
                        type="text"
                        id="spec-certification"
                        name="spec_certification"
                        value={formData.specifications.certification}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.certificationPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-density" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.density')}
                      </label>
                      <input
                        type="text"
                        id="spec-density"
                        name="spec_density"
                        value={formData.specifications.density}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.densityPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-grade" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.grade')}
                      </label>
                      <input
                        type="text"
                        id="spec-grade"
                        name="spec_grade"
                        value={formData.specifications.grade}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.gradePlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-accuracy" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.accuracy')}
                      </label>
                      <input
                        type="text"
                        id="spec-accuracy"
                        name="spec_accuracy"
                        value={formData.specifications.accuracy}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.accuracyPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-turnaround" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.turnaround')}
                      </label>
                      <input
                        type="text"
                        id="spec-turnaround"
                        name="spec_turnaround"
                        value={formData.specifications.turnaround}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.turnaroundPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-maxSize" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.maxSize')}
                      </label>
                      <input
                        type="text"
                        id="spec-maxSize"
                        name="spec_maxSize"
                        value={formData.specifications.maxSize}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.maxSizePlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-firmness" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.firmness')}
                      </label>
                      <input
                        type="text"
                        id="spec-firmness"
                        name="spec_firmness"
                        value={formData.specifications.firmness}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.firmnessPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="spec-height" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.products.form.specifications.height')}
                      </label>
                      <input
                        type="text"
                        id="spec-height"
                        name="spec_height"
                        value={formData.specifications.height}
                        onChange={handleInputChange}
                        placeholder={t('admin.products.form.specifications.heightPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="spec-additional" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.products.form.specifications.additional')}
                    </label>
                    <textarea
                      id="spec-additional"
                      name="spec_additional"
                      value={formData.specifications.additional}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={t('admin.products.form.specifications.additionalPlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{t('admin.products.form.featuredProduct')}</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{t('products.inStock')}</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="loginRequired"
                      checked={formData.loginRequired}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{t('admin.products.form.loginRequired')}</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="premium"
                      checked={formData.premium}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{t('admin.products.form.premiumMembershipRequired')}</span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={uploading}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('admin.products.form.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {uploading && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <span>{uploading ? t('admin.products.form.uploading') : (modalMode === 'create' ? t('admin.products.form.createProduct') : t('admin.products.form.updateProduct'))}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
