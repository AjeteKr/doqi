import React from 'react'
import { useTranslation } from 'react-i18next'
import Hero from '../components/Hero'
import ProductsGrid from '../components/ProductsGrid'
import Reviews from '../components/Reviews'

const Home = () => {
  const { t } = useTranslation()
  const featuredProducts = []

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Featured Products Section */}
      <ProductsGrid 
        products={featuredProducts.slice(0, 6)} 
        title={t('home.featuredProducts')} 
      />
      
      {/* Company Introduction */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
              {t('home.aboutTitle')}
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-6">
                {t('home.aboutDescription1')}
              </p>
              <p className="text-lg text-gray-700">
                {t('home.aboutDescription2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <Reviews />
    </div>
  )
}

export default Home