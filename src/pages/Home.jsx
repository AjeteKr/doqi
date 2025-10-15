import React from 'react'
import { useTranslation } from 'react-i18next'
import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import LatestArrivals from '../components/LatestArrivals'
import ProductsGrid from '../components/ProductsGrid'
import Reviews from '../components/Reviews'

const Home = () => {
  const { t } = useTranslation()
  const featuredProducts = []

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Latest Arrivals Section */}
      <LatestArrivals />
      
      {/* Featured Products Section */}
      <ProductsGrid 
        products={featuredProducts.slice(0, 6)} 
        title={t('home.featuredProducts')} 
      />
      
      {/* Customer Reviews */}
      <Reviews />
    </div>
  )
}

export default Home