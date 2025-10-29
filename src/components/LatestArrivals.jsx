import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'

const LatestArrivals = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const scrollContainerRef = useRef(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)
  const [latestProducts, setLatestProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch products and get the latest ones
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch('/products.json')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        const products = data.products || []
        
        const latest = products.slice(-8).reverse()
        setLatestProducts(latest)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching latest products:', error)
        setLatestProducts([])
        setLoading(false)
      }
    }

    fetchLatestProducts()
  }, [])

  const getProductImagePath = (imagePath) => {
    if (imagePath?.startsWith('http') || imagePath?.startsWith('/')) {
      return imagePath
    }
    return `/images/products/${imagePath}`
  }

  const handleProductClick = (product) => {
    const slug = product.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    navigate(`/product/${slug}`, { state: { product } })
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      
      // Show left button if not at the beginning
      setShowLeftButton(scrollLeft > 0)
      
      // Show right button if not at the end
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
  }, [])

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-black mb-3">
            {t('home.latestArrivals')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('home.latestArrivalsSubtitle')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('products.loading')}</p>
          </div>
        ) : latestProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t('products.noProducts')}</p>
          </div>
        ) : (
          <div className="relative">
            {showLeftButton && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-110 border border-gray-200"
                style={{ marginLeft: '-24px' }}
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {showRightButton && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-110 border border-gray-200"
                style={{ marginRight: '-24px' }}
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="flex space-x-6 pb-6 px-2">
                {latestProducts.map((product) => (
                  <div 
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="relative bg-gray-200 rounded-lg overflow-hidden group cursor-pointer flex-shrink-0 w-80"
                  >
                    {/* Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(product)
                      }}
                      className="absolute top-4 left-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <svg 
                        className={`w-5 h-5 transition-colors ${
                          isFavorite(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'fill-none text-gray-600'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>

                    {/* Product Image */}
                    <div className="aspect-[4/3] bg-gray-300">
                      <img 
                        src={getProductImagePath(product.image)}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.jpg'
                        }}
                      />
                    </div>

                    {/* Product Name */}
                    <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded">
                      <h3 className="text-sm font-medium text-black">
                        {product.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default LatestArrivals
