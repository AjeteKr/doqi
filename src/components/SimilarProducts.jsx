import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../context/FavoritesContext'
import { HeartIcon, MapPinIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

const SimilarProducts = ({ currentProduct, allProducts }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const scrollContainerRef = useRef(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)

  // Get similar products using smart matching logic
  const getSimilarProducts = () => {
    if (!currentProduct || !allProducts.length) return []

    const currentProductId = currentProduct.id
    let similarProducts = []

    // Priority 1: Same subcategory (if exists)
    if (currentProduct.subcategory) {
      similarProducts = allProducts.filter(p => 
        p.id !== currentProductId && 
        p.subcategory === currentProduct.subcategory
      )
    }

    // Priority 2: Same category (if subcategory didn't yield enough results)
    if (similarProducts.length < 8 && currentProduct.category) {
      const categoryProducts = allProducts.filter(p => 
        p.id !== currentProductId && 
        p.category === currentProduct.category &&
        !similarProducts.find(sp => sp.id === p.id)
      )
      similarProducts = [...similarProducts, ...categoryProducts]
    }

    // Priority 3: Same starting letter (if still not enough)
    if (similarProducts.length < 8) {
      const firstLetter = currentProduct.title?.charAt(0).toLowerCase()
      const letterProducts = allProducts.filter(p => 
        p.id !== currentProductId && 
        p.title?.charAt(0).toLowerCase() === firstLetter &&
        !similarProducts.find(sp => sp.id === p.id)
      )
      similarProducts = [...similarProducts, ...letterProducts]
    }

    // Fallback: Any other products
    if (similarProducts.length < 8) {
      const remainingProducts = allProducts.filter(p => 
        p.id !== currentProductId &&
        !similarProducts.find(sp => sp.id === p.id)
      )
      similarProducts = [...similarProducts, ...remainingProducts]
    }

    return similarProducts.slice(0, 12)
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -340,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 340,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    checkScrollButtons()
    
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [currentProduct, allProducts])

  const getProductImagePath = (imagePath) => {
    if (imagePath?.startsWith('http') || imagePath?.startsWith('/')) {
      return imagePath
    }
    return `/images/products/${imagePath}`
  }

  const handleProductClick = (product) => {
    const newSlug = product.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    navigate(`/product/${newSlug}`, { state: { product } })
  }

  const similarProducts = getSimilarProducts()

  if (similarProducts.length === 0) {
    return null
  }

  return (
    <div className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-12 bg-red-600 rounded-full"></div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              {t('productDetails.similarProducts')}
            </h2>
          </div>
          <p className="text-sm text-gray-600 ml-6">
            {currentProduct.subcategory 
              ? `${t('productDetails.basedOnSubcategory')}: ${currentProduct.subcategory}`
              : currentProduct.category 
                ? `${t('productDetails.basedOnCategory')}: ${currentProduct.category}`
                : t('productDetails.recommendedForYou')
            }
          </p>
        </div>

        <div className="relative">
          {/* Left Scroll Button */}
          {showLeftButton && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center hover:bg-red-50 transition-all duration-200 hover:scale-110 border-2 border-red-600/20"
              style={{ marginLeft: '-24px' }}
            >
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Scroll Button */}
          {showRightButton && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center hover:bg-red-50 transition-all duration-200 hover:scale-110 border-2 border-red-600/20"
              style={{ marginRight: '-24px' }}
            >
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="flex space-x-6 pb-6 px-2">
              {similarProducts.map((similarProduct) => (
                <div 
                  key={similarProduct.id}
                  onClick={() => handleProductClick(similarProduct)}
                  className="relative bg-white rounded-2xl overflow-hidden group cursor-pointer flex-shrink-0 w-80 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-600/50"
                >
                  {/* Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(similarProduct)
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg hover:scale-110"
                  >
                    {isFavorite(similarProduct.id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>

                  {/* Category Badge */}
                  {(similarProduct.subcategory || similarProduct.category) && (
                    <div className="absolute top-4 left-4 z-10 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                      {similarProduct.subcategory || similarProduct.category}
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img 
                      src={getProductImagePath(similarProduct.image)}
                      alt={similarProduct.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.jpg'
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-5 bg-gradient-to-b from-white to-gray-50">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-2 min-h-[3rem]">
                      {similarProduct.title}
                    </h3>
                    
                    <div className="flex items-center justify-between border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        {similarProduct.origin && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <MapPinIcon className="w-3 h-3" />
                            {similarProduct.origin}
                          </span>
                        )}
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar hiding styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default SimilarProducts
