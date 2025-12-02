import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../../components/ProductCard'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import compactHPLIcon from '../../assets/icons/compactHPL.png'
import sofaChairIcon from '../../assets/icons/sofa-chair.png'
import mdfChipBoardIcon from '../../assets/icons/mdf-ChipBoard.png'
import accessoriesIcon from '../../assets/icons/accessories.png'
import mattressIcon from '../../assets/icons/mattress.png'
import cuttingIcon from '../../assets/icons/cutting.png'

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
  const [showSubCategories, setShowSubCategories] = useState(false)
  const searchRef = useRef(null)

  const categories = [
    { 
      key: 'mdfChipBoard', 
      translationKey: 'products.categories.mdfChipBoard',
      icon: mdfChipBoardIcon,
      hasSubCategories: false 
    },
    { 
      key: 'mattress', 
      translationKey: 'products.categories.mattress',
      icon: mattressIcon,
      hasSubCategories: true,
      subCategories: ['ecoFlex', 'mediumFlex', 'starFlex', 'hotelLineConcept']
    },
    { 
      key: 'accessories', 
      translationKey: 'products.categories.accessories',
      icon: accessoriesIcon,
      hasSubCategories: false 
    },
    { 
      key: 'customerService', 
      translationKey: 'products.categories.customerService',
      icon: cuttingIcon,
      hasSubCategories: true,
      subCategories: ['cutting', 'edgeBanding', 'cnc']
    },
    { 
      key: 'compactHPL', 
      translationKey: 'products.categories.compactHPL',
      icon: compactHPLIcon,
      hasSubCategories: false 
    },
    { 
      key: 'sofaChair', 
      translationKey: 'products.categories.sofaChair',
      icon: sofaChairIcon,
      hasSubCategories: true,
      subCategories: ['sofa', 'chair']
    }
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

    // Filter by category (if not 'all')
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by subcategory (if not 'all')
    if (selectedSubCategory && selectedSubCategory !== 'all') {
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

  const handleCategoryClick = (categoryKey) => {
    const category = categories.find(cat => cat.key === categoryKey)
    
    if (category && category.hasSubCategories) {
      if (selectedCategory === categoryKey && showSubCategories) {
        // Deselect category
        setShowSubCategories(false)
        setSelectedCategory(null)
        setSelectedSubCategory(null)
      } else {
        // Select category with subcategories
        setSelectedCategory(categoryKey)
        setShowSubCategories(true)
        setSelectedSubCategory(null)
      }
    } else {
      // Category without subcategories
      setSelectedCategory(categoryKey)
      setShowSubCategories(false)
      setSelectedSubCategory(null)
    }
  }

  const handleSubCategoryClick = (subCategoryKey) => {
    setSelectedSubCategory(subCategoryKey)
  }

  const clearAllFilters = () => {
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setShowSubCategories(false)
    setSearchQuery('')
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

      {/* Category Filters - Grid Style */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-6">
            <h2 className="text-2xl sm:text-3xl font-normal text-black mb-2">
              {t('products.ourProducts')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {t('products.findYourPerfectPiece')}
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 lg:gap-6 mb-6">
            {categories.map((category) => (
              <div
                key={category.key}
                onClick={() => handleCategoryClick(category.key)}
                className={`group relative rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  selectedCategory === category.key 
                    ? 'bg-red-400' 
                    : 'bg-gray-200 hover:bg-red-400'
                }`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4 relative z-10">
                  <img 
                    src={category.icon} 
                    alt={t(category.translationKey)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain transition-all duration-300 ${
                      selectedCategory === category.key 
                        ? 'brightness-0 invert' 
                        : 'group-hover:brightness-0 group-hover:invert'
                    }`}
                  />
                </div>
                
                {/* Category Name */}
                <h3 className={`text-center text-xs sm:text-sm lg:text-sm font-medium transition-colors relative z-10 leading-tight ${
                  selectedCategory === category.key 
                    ? 'text-white' 
                    : 'text-gray-800 group-hover:text-white'
                }`}>
                  {t(category.translationKey)}
                </h3>
              </div>
            ))}
          </div>

          {/* Sub-Categories */}
          {showSubCategories && selectedCategory && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-4">
                <span
                  onClick={() => handleSubCategoryClick(null)}
                  className={`cursor-pointer transition-colors duration-200 text-lg font-medium ${
                    selectedSubCategory === null
                      ? 'text-red-500 font-semibold'
                      : 'text-gray-600 hover:text-red-400'
                  }`}
                >
                  {t('products.subCategories.all')}
                </span>
                
                {categories.find(cat => cat.key === selectedCategory)?.subCategories?.map((subCategory) => (
                  <span
                    key={subCategory}
                    onClick={() => handleSubCategoryClick(subCategory)}
                    className={`cursor-pointer transition-colors duration-200 text-lg font-medium ${
                      selectedSubCategory === subCategory
                        ? 'text-red-500 font-semibold'
                        : 'text-gray-600 hover:text-red-400'
                    }`}
                  >
                    {t(`products.subCategories.${subCategory}`)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters Button */}
          {(selectedCategory || searchQuery) && (
            <div className="text-center">
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 hover:border-red-600 hover:text-red-600 transition-all duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
                {t('products.clearAllFilters')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
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