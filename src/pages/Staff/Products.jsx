import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getProductStats, getAllProducts } from '../../services/productService';
import {
  MagnifyingGlassIcon,
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function StaffProducts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, inStock: 0, outOfStock: 0 });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const categories = [
    { key: 'all', label: t('common.all') },
    { key: 'customerService', label: t('products.categories.customerService') },
    { key: 'mattress', label: t('products.categories.mattress') },
    { key: 'sofaChair', label: t('products.categories.sofaChair') },
    { key: 'mdfChipBoard', label: t('products.categories.mdfChipBoard') },
    { key: 'compactHPL', label: t('products.categories.compactHPL') },
    { key: 'accessories', label: t('products.categories.accessories') }
  ];

  useEffect(() => {
    // Check if user is staff (role_id = 2)
    if (!isAuthenticated || !user || user.role !== 2) {
      navigate('/');
      return;
    }
    
    fetchProducts();
    fetchStats();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await getAllProducts(1, 1000); // Fetch up to 1000 products
      setProducts(result.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const stats = await getProductStats();
      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Filter by stock status
    if (stockFilter === 'inStock') {
      filtered = filtered.filter(p => p.inStock === true);
    } else if (stockFilter === 'outOfStock') {
      filtered = filtered.filter(p => p.inStock === false);
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('staff.products.title')}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('staff.products.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('staff.products.stats.total')}
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_products || products.length}</p>
            </div>
            <CubeIcon className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('staff.products.stats.inStock')}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.in_stock_products || products.filter(p => p.inStock).length}
              </p>
            </div>
            <CheckCircleIcon className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('staff.products.stats.outOfStock')}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {(stats.total_products || 0) - (stats.in_stock_products || 0) || products.filter(p => !p.inStock).length}
              </p>
            </div>
            <XCircleIcon className="w-12 h-12 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('staff.products.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">{t('staff.products.filter.all')}</option>
            <option value="inStock">{t('staff.products.filter.inStock')}</option>
            <option value="outOfStock">{t('staff.products.filter.outOfStock')}</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('staff.products.noProducts')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('staff.products.table.product')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('staff.products.table.category')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('staff.products.table.origin')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('staff.products.table.stock')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('staff.products.table.featured')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.image && (
                          <img
                            src={`/images/products/${product.image}`}
                            alt={product.title}
                            className="w-12 h-12 rounded object-cover mr-4"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {t(`products.categories.${product.category}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.origin || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.inStock ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {t('staff.products.inStock')}
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {t('staff.products.outOfStock')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.featured ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-gray-300" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredProducts.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          {t('staff.products.showing')} {filteredProducts.length} {t('staff.products.of')} {products.length} {t('staff.products.products')}
        </div>
      )}
    </div>
  );
}
