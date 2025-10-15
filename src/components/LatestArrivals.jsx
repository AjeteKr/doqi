import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LatestArrivals = () => {
  const { t } = useTranslation()
  const [favorites, setFavorites] = useState({})

  // Sample products - you can replace this with actual data
  const latestProducts = [
    {
      id: 1,
      name: 'KAPOK Cortina Walnut',
      image: '/images/kapok-cortina.jpg'
    },
    {
      id: 2,
      name: 'Melamine MDF board',
      image: '/images/melamine-mdf.jpg'
    },
    {
      id: 3,
      name: 'PVC marble sheet',
      image: '/images/pvc-marble.jpg'
    }
  ]

  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {latestProducts.map((product) => (
            <div 
              key={product.id}
              className="relative bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
            >
              {/* Heart Icon */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-4 left-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg 
                  className={`w-5 h-5 transition-colors ${
                    favorites[product.id] 
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
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>

              {/* Product Name */}
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded">
                <h3 className="text-sm font-medium text-black">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestArrivals
