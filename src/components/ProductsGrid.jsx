import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ProductsGrid = ({ selectedCategory = null, selectedSubCategory = null, title = null }) => {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/products.json')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        setError(err.message)
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

  const formatPrice = (price) => {
    return price || 'Contact for price'
  }

  const getProductImagePath = (imagePath) => {
    // Handle both relative and absolute paths
    if (imagePath?.startsWith('http') || imagePath?.startsWith('/')) {
      return imagePath
    }
    return `/images/products/${imagePath}`
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
            <p>Error loading products: {error}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
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
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Heart/Favorite Icon */}
                <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">{product.title}</h3>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsGrid