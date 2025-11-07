import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../../context/FavoritesContext'
import { HeartIcon, ArrowLeftIcon, MapPinIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import SimilarProducts from '../../components/SimilarProducts'

const ProductDetails = () => {
  const { t } = useTranslation()
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
        
        // Always fetch all products for similar products section
        const response = await fetch('/products.json')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        const products = data.products || []
        setAllProducts(products)

        // Use product from location state if available
        if (location.state?.product) {
          setProduct(location.state.product)
          setLoading(false)
          return
        }

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
    <div className="min-h-screen bg-white">
      {/* Hero Section with Creative Layout */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50/30">
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100/50 rounded-full blur-3xl"></div>
        
        {/* Breadcrumb - Minimal Glass */}
        <div className="relative pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
          <nav className="flex items-center space-x-2 backdrop-blur-sm bg-white/60 rounded-full px-5 py-2.5 w-fit border border-gray-200/50">
            <Link to="/" className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium">
              {t('nav.home')}
            </Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
            >
              {t('nav.products')}
            </button>
            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold text-sm max-w-xs truncate">
              {product.title}
            </span>
          </nav>
        </div>

        {/* Product Hero - Creative Split Layout */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Image with Creative Frame */}
            <div className="relative">
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 z-20 flex gap-2">
                <button
                  onClick={() => toggleFavorite(product)}
                  className="backdrop-blur-md bg-white/80 border border-gray-200/50 p-3 rounded-2xl hover:bg-white transition-all duration-300 group"
                >
                  {isFavorite(product.id) ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-600" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                  )}
                </button>
              </div>

              {/* Status Badges */}
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                {product.inStock && (
                  <span className="backdrop-blur-md bg-green-500/90 text-white text-xs px-3 py-1.5 rounded-lg font-semibold">
                    {t('products.inStock')}
                  </span>
                )}
                {product.featured && (
                  <span className="backdrop-blur-md bg-red-600/90 text-white text-xs px-3 py-1.5 rounded-lg font-semibold">
                    Featured
                  </span>
                )}
              </div>

              {/* Image Container with Border Animation */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative backdrop-blur-sm bg-white/40 rounded-3xl p-4 border border-white/60">
                  <div className="relative overflow-hidden rounded-2xl bg-white/80">
                    <img 
                      src={getProductImagePath(product.image)} 
                      alt={product.title}
                      className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.jpg'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <span className="backdrop-blur-sm bg-gray-900/5 text-gray-900 text-xs px-4 py-2 rounded-full font-bold border border-gray-900/10">
                    {product.category}
                  </span>
                )}
                {product.subCategory && (
                  <span className="backdrop-blur-sm bg-red-600/10 text-red-600 text-xs px-4 py-2 rounded-full font-bold border border-red-600/20">
                    {product.subCategory}
                  </span>
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              
              {/* Description */}
              {product.description && (
                <p className="text-gray-600 text-xl leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Origin */}
              {product.origin && (
                <div className="flex items-center gap-3 backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-gray-200/50 w-fit">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <MapPinIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">{t('productDetails.origin')}</div>
                    <div className="text-base text-gray-900 font-bold">{product.origin}</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Link 
                  to="/contact"
                  className="flex-1 bg-red-600 text-white py-4 px-8 rounded-2xl hover:bg-red-700 transition-all duration-300 font-bold text-center transform hover:scale-105"
                >
                  {t('productDetails.requestQuote')}
                </Link>
                <button 
                  onClick={() => navigate(-1)}
                  className="backdrop-blur-sm bg-gray-900/5 border border-gray-900/10 text-gray-900 py-4 px-8 rounded-2xl hover:bg-gray-900/10 transition-all duration-300 font-bold"
                >
                  ← {t('productDetails.backToProducts')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section - Creative Cards */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-2 h-12 bg-red-600 rounded-full"></div>
              <h2 className="text-4xl font-bold text-gray-900">
                {t('productDetails.technicalSpecs')}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(product.specifications).map(([key, value], index) => {
                if (!value) return null
                return (
                  <div 
                    key={key} 
                    className="group relative backdrop-blur-sm bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-red-600/50 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-100/30 rounded-bl-3xl"></div>
                    <div className="relative">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-2xl text-gray-900 font-bold">
                        {value}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Product Features & Applications Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Features */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-12 bg-red-600 rounded-full"></div>
                <h2 className="text-3xl font-bold text-gray-900">{t('productDetails.keyFeatures')}</h2>
              </div>
              <div className="space-y-4">
                {product.specifications?.material && (
                  <div className="flex items-start gap-4 backdrop-blur-sm bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                    <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">{t('productDetails.features.premiumMaterial')}</div>
                      <div className="text-gray-600">{product.specifications.material}</div>
                    </div>
                  </div>
                )}
                {product.specifications?.finish && (
                  <div className="flex items-start gap-4 backdrop-blur-sm bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                    <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">{t('productDetails.features.surfaceFinish')}</div>
                      <div className="text-gray-600">{product.specifications.finish}</div>
                    </div>
                  </div>
                )}
                {product.specifications?.warranty && (
                  <div className="flex items-start gap-4 backdrop-blur-sm bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                    <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">{t('productDetails.features.warranty')}</div>
                      <div className="text-gray-600">{product.specifications.warranty}</div>
                    </div>
                  </div>
                )}
                {product.specifications?.certification && (
                  <div className="flex items-start gap-4 backdrop-blur-sm bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                    <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">{t('productDetails.features.certifiedQuality')}</div>
                      <div className="text-gray-600">{product.specifications.certification}</div>
                    </div>
                  </div>
                )}
                {!product.specifications?.material && !product.specifications?.finish && !product.specifications?.warranty && !product.specifications?.certification && (
                  <div className="backdrop-blur-sm bg-gray-50/80 rounded-2xl p-6 border border-gray-200/50">
                    <p className="text-gray-600 text-center">{t('productDetails.features.contactForFeatures')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Applications / Usage Areas */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-12 bg-red-600 rounded-full"></div>
                <h2 className="text-3xl font-bold text-gray-900">{t('productDetails.applications')}</h2>
              </div>
              <div className="backdrop-blur-sm bg-gradient-to-br from-red-50/50 to-gray-50/50 rounded-3xl p-8 border border-gray-200/50">
                <div className="space-y-6">
                  {product.category === 'compactHPL' && (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.compactHPL.item1')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.compactHPL.item2')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.compactHPL.item3')}</p>
                      </div>
                    </>
                  )}
                  {product.category === 'mattress' && (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.mattress.item1')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.mattress.item2')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.mattress.item3')}</p>
                      </div>
                    </>
                  )}
                  {product.category === 'mdfChipBoard' && (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.mdfChipBoard.item1')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.mdfChipBoard.item2')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.mdfChipBoard.item3')}</p>
                      </div>
                    </>
                  )}
                  {product.category === 'sofaChair' && (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.sofaChair.item1')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.sofaChair.item2')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.sofaChair.item3')}</p>
                      </div>
                    </>
                  )}
                  {!['compactHPL', 'mattress', 'mdfChipBoard', 'sofaChair'].includes(product.category) && (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.default.item1')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.default.item2')}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-600 text-xl">•</span>
                        <p className="text-gray-700">{t('productDetails.usageAreas.default.item3')}</p>
                      </div>
                    </>
                  )}
                  
                  {product.specifications?.additional && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-gray-700 italic">{product.specifications.additional}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <SimilarProducts currentProduct={product} allProducts={allProducts} />
    </div>
  )
}

export default ProductDetails