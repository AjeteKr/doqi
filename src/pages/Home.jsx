import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import LatestArrivals from '../components/LatestArrivals'
import ProductCategories from '../components/ProductCategories'
import ProductsGrid from '../components/ProductsGrid'
import Reviews from '../components/Reviews'

const Home = () => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const featuredProducts = []

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Latest Arrivals Section */}
      <LatestArrivals />
      
      {/* Product Categories Section */}
      <ProductCategories onCategoryChange={handleCategoryChange} />
      
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