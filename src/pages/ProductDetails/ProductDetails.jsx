import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext'
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

const ProductDetails = () => {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        
        if (location.state?.product) {
          setProduct(location.state.product)
          setLoading(false)
          return
        }

        const response = await fetch('/products.json')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        const products = data.products || []
        setAllProducts(products)

        // Find product by matching slug
        const foundProduct = products.find(p => {
          const productSlug = p.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
          return productSlug === slug
        })

        setProduct(foundProduct || null)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    loadProduct()
  }, [slug, location.state])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link 
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const getProductImagePath = (imagePath) => {
    if (imagePath?.startsWith('http') || imagePath?.startsWith('/')) {
      return imagePath
    }
    return `/images/products/${imagePath}`
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-500 hover:text-red-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <button 
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                Products
              </button>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="lg:flex">
            {/* Product Image */}
            <div className="lg:w-1/2 relative">
              <div className="aspect-w-16 aspect-h-9 lg:aspect-none lg:h-full">
                {product.image ? (
                  <img 
                    src={getProductImagePath(product.image)} 
                    alt={product.title}
                    className="w-full h-64 sm:h-80 lg:h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg'
                    }}
                  />
                ) : (
                  <div className="w-full h-64 sm:h-80 lg:h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.inStock && (
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                    In Stock
                  </span>
                )}
                {product.featured && (
                  <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12">
              {/* Category and Subcategory */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.category && (
                  <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium">
                    {product.category}
                  </span>
                )}
                {product.subCategory && (
                  <span className="bg-red-50 text-red-700 text-sm px-3 py-1 rounded-full font-medium">
                    {product.subCategory}
                  </span>
                )}
              </div>
              
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex-1 mr-4">
                  {product.title}
                </h1>
                <button
                  onClick={() => toggleFavorite(product)}
                  className="flex-shrink-0 p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
                >
                  {isFavorite(product.id) ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
                  )}
                </button>
              </div>
              
              {product.description && (
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Origin Information */}
              {product.origin && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600 font-medium">Origin:</span>
                    <span className="text-gray-900 font-semibold">{product.origin}</span>
                  </div>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => {
                      if (!value) return null
                      return (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-gray-900 font-medium">{value}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/contact"
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold text-center"
                >
                  Request Quote
                </Link>
                <button 
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Back to Products
                </button>
              </div>

              {/* Contact Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Need More Information?</h4>
                <p className="text-gray-600 text-sm">
                  Contact our team for detailed specifications, custom sizing, or bulk pricing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {allProducts.length > 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    onClick={() => {
                      const newSlug = relatedProduct.title
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim()
                      navigate(`/product/${newSlug}`, { state: { product: relatedProduct } })
                    }}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={getProductImagePath(relatedProduct.image)}
                        alt={relatedProduct.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.jpg'
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {relatedProduct.title}
                      </h3>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails