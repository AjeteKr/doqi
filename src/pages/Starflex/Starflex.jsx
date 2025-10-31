import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  CheckCircleIcon, 
  SparklesIcon,
  ShieldCheckIcon,
  CubeIcon,
  TruckIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const Starflex = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mattressProducts, setMattressProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch mattress products
  useEffect(() => {
    const fetchMattressProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/products.json')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        // Filter only mattress category products
        const mattresses = data.products.filter(product => product.category === 'mattress')
        setMattressProducts(mattresses)
      } catch (err) {
        console.error('Error fetching mattress products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMattressProducts()
  }, [])

  const features = [
    {
      icon: ShieldCheckIcon,
      title: t('starflex.features.quality.title'),
      description: t('starflex.features.quality.description')
    },
    {
      icon: SparklesIcon,
      title: t('starflex.features.comfort.title'),
      description: t('starflex.features.comfort.description')
    },
    {
      icon: CubeIcon,
      title: t('starflex.features.variety.title'),
      description: t('starflex.features.variety.description')
    },
    {
      icon: ShieldCheckIcon,
      title: t('starflex.features.warranty.title'),
      description: t('starflex.features.warranty.description')
    },
    {
      icon: TruckIcon,
      title: t('starflex.features.delivery.title'),
      description: t('starflex.features.delivery.description')
    },
    {
      icon: HeartIcon,
      title: t('starflex.features.health.title'),
      description: t('starflex.features.health.description')
    }
  ]

  const getProductImagePath = (imagePath) => {
    if (imagePath?.startsWith('http') || imagePath?.startsWith('/')) {
      return imagePath
    }
    return `/images/products/${imagePath}`
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleProductClick = (product) => {
    const slug = generateSlug(product.title)
    navigate(`/product/${slug}`, { state: { product } })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-700 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full mb-6">
                <SparklesIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{t('starflex.badge')}</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
                  StarFlex
                </span>
                <br />
                <span className="text-3xl md:text-4xl text-gray-200">
                  {t('starflex.hero.subtitle')}
                </span>
              </h1>
              
              <p className="text-xl text-gray-100 mb-8 leading-relaxed">
                {t('starflex.hero.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/products?category=mattress"
                  className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {t('starflex.hero.shopNow')}
                </Link>
                <Link 
                  to="/contact"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  {t('starflex.hero.contact')}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">2011</div>
                  <div className="text-sm text-gray-300">{t('starflex.since')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">10+</div>
                  <div className="text-sm text-gray-300">{t('starflex.years')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">5000+</div>
                  <div className="text-sm text-gray-300">{t('starflex.customers')}</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="images/hero-bg-3.png"
                  alt="StarFlex Mattress"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white text-black p-6 rounded-xl shadow-2xl border-2 border-red-600">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-8 h-8 text-red-600" />
                  <div>
                    <div className="font-bold text-lg">{t('starflex.certified')}</div>
                    <div className="text-sm text-gray-600">{t('starflex.certifiedText')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('starflex.whyChoose')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('starflex.whyChooseDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gray-50 rounded-xl hover:bg-red-50 transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-red-600"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-red-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mattress Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('starflex.ourCollection')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('starflex.collectionDescription')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('products.loading')}</p>
            </div>
          ) : mattressProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mattressProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img 
                        src={getProductImagePath(product.image)}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{product.title}</h3>
                      {product.subCategory && (
                        <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                          {product.subCategory}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description || t('starflex.collectionDescription')}
                    </p>
                    <div className="flex items-center justify-between">
                      {product.origin && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm font-medium">{product.origin}</span>
                        </div>
                      )}
                      <span className="text-red-600 hover:text-red-700 font-medium text-sm group-hover:underline flex items-center gap-1">
                        {t('starflex.viewDetails')}
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-6">
                {t('products.noProducts')}
              </p>
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('products.browseAll')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}

          {mattressProducts.length > 0 && (
            <div className="mt-12 text-center">
              <Link 
                to="/products?category=mattress"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                {t('products.seeMoreProducts')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('starflex.cta.title')}
          </h2>
          <p className="text-xl text-red-100 mb-8">
            {t('starflex.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              {t('starflex.cta.visitShowroom')}
            </Link>
            <Link 
              to="/products?category=mattress"
              className="px-8 py-4 bg-black border-2 border-white text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300"
            >
              {t('starflex.cta.browseCollection')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Starflex
