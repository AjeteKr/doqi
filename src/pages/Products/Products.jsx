import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

const Products = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubCategory, setSelectedSubCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const searchRef = useRef(null)

  const categories = [
    { key: 'all', translationKey: 'products.categories.all' },
    { key: 'compactHPL', translationKey: 'products.categories.compactHPL' },
    { key: 'mattress', translationKey: 'products.categories.mattress' },
    { key: 'sofaChair', translationKey: 'products.categories.sofaChair' },
    { key: 'mdfChipBoard', translationKey: 'products.categories.mdfChipBoard' },
    { key: 'customerService', translationKey: 'products.categories.customerService' },
    { key: 'accessories', translationKey: 'products.categories.accessories' }
  ]

  const subCategories = [
    { key: 'all', translationKey: 'products.subCategories.all' },
    { key: 'cutting', translationKey: 'products.subCategories.cutting' },
    { key: 'edgeBanding', translationKey: 'products.subCategories.edgeBanding' },
    { key: 'cnc', translationKey: 'products.subCategories.cnc' },
    { key: 'ecoFlex', translationKey: 'products.subCategories.ecoFlex' },
    { key: 'mediumFlex', translationKey: 'products.subCategories.mediumFlex' },
    { key: 'starFlex', translationKey: 'products.subCategories.starFlex' },
    { key: 'hotelLineConcept', translationKey: 'products.subCategories.hotelLineConcept' },
    { key: 'sofa', translationKey: 'products.subCategories.sofa' },
    { key: 'chair', translationKey: 'products.subCategories.chair' }
  ]

  // Load products from JSON
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/products.json')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        const productsData = data.products || []
        setProducts(productsData)
        setFilteredProducts(productsData)
        setLoading(false)
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
        setFilteredProducts([])
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Handle search and filtering
  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by subcategory
    if (selectedSubCategory !== 'all') {
      filtered = filtered.filter(product => product.subCategory === selectedSubCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, selectedSubCategory, searchQuery])

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase()
      const suggestions = products
        .filter(product =>
          product.title?.toLowerCase().includes(query)
        )
        .slice(0, 5) // Limit to 5 suggestions
      setSearchSuggestions(suggestions)
    } else {
      setSearchSuggestions([])
    }
  }, [searchQuery, products])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (product) => {
    const slug = product.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    navigate(`/product/${slug}`, { state: { product } })
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setShowSuggestions(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('products.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20">
      {/* Page Header with Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{t('products.title')}</h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('products.subtitle')}
            </p>

            {/* Search Bar with Autocomplete */}
            <div className="max-w-2xl mx-auto relative" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={t('common.search') + '...'}
                  className="block w-full pl-12 pr-12 py-4 border-2 border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent text-lg transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="py-2">
                    {searchSuggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick(product)}
                        className="w-full px-4 py-3 hover:bg-red-50 transition-colors duration-150 flex items-center gap-4 group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.image?.startsWith('http') || product.image?.startsWith('/') ? product.image : `/images/products/${product.image}`}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/images/placeholder-product.jpg'
                            }}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                            {product.title}
                          </div>
                          {product.category && (
                            <div className="text-sm text-gray-500">{product.category}</div>
                          )}
                        </div>
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {t('common.category')}
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => {
                  setSelectedCategory(category.key)
                  setSelectedSubCategory('all')
                }}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === category.key
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-red-600 hover:text-red-600'
                }`}
              >
                {t(category.translationKey)}
              </button>
            ))}
          </div>
        </div>

        {/* SubCategory Filters */}
        {selectedCategory !== 'all' && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Sub {t('common.category')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {subCategories.map((subCategory) => (
                <button
                  key={subCategory.key}
                  onClick={() => setSelectedSubCategory(subCategory.key)}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-200 text-sm ${
                    selectedSubCategory === subCategory.key
                      ? 'bg-red-100 text-red-600 border-2 border-red-600'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {t(subCategory.translationKey)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `${t('common.search')} "${searchQuery}"` : t('products.ourProducts')}
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? t('products.productFound') : t('products.productsFound')}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('products.noProducts')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('products.tryAdjusting')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedSubCategory('all')
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors font-semibold"
            >
              {t('products.clearAllFilters')}
            </button>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

export default Products