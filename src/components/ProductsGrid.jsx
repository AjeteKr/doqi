import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { getPublicProducts } from '../services/productService'

const ProductsGrid = ({ selectedCategory = null, selectedSubCategory = null, title = null }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const filters = {}
        if (selectedCategory) filters.category = selectedCategory
        if (selectedSubCategory) filters.subCategory = selectedSubCategory
        // Don't filter by featured - show all products in "Our Products" section
        
        const data = await getPublicProducts(1, 100, filters)
        setProducts(data.products || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, selectedSubCategory])

  // Filter products based on selected category and subcategory
  const filteredProducts = products.filter(product => {
    // If no category selected, show all products
    if (!selectedCategory) return true

    // If category doesn't match, don't show
    if (product.category !== selectedCategory) return false

    // If subcategory is selected, check if it matches
    if (selectedSubCategory) {
      return product.subCategory === selectedSubCategory
    }

    // If no subcategory selected, show all products in the main category
    return true
  })

  // Limit products to 8 for all screen sizes
  const maxProducts = 8
  const displayProducts = filteredProducts.slice(0, maxProducts)
  const hasMoreProducts = filteredProducts.length > maxProducts

  const getProductImagePath = (imagePath) => {
    // Handle both relative and absolute paths
    if (imagePath?.startsWith('http') || imagePath?.startsWith('/')) {
      return imagePath
    }
    return `/images/products/${imagePath}`
  }

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`)
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('products.loading')}</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{t('ui.productsErrorLoading', { error })}</p>
          </div>
        </div>
      </section>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">{t('products.noProducts')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">




        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product);
                }}
                className="absolute top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              >
                {isFavorite(product.id) ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                )}
              </button>

              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-gray-50">
                {product.image ? (
                  <img
                    src={getProductImagePath(product.image)}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                  {product.title}
                </h3>
                
                {/* Origin */}
                {product.origin && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">
                      {product.origin}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* See More Products Button */}
        {hasMoreProducts && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <span>{t('products.seeMoreProducts')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsGrid