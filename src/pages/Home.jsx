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
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)

  const handleCategoryChange = (filterValue) => {
    if (!filterValue) {
      // Reset filters
      setSelectedCategory(null)
      setSelectedSubCategory(null)
      return
    }

    // Check if it's a subcategory selection (format: "category.subcategory")
    if (filterValue.includes('.')) {
      const [category, subCategory] = filterValue.split('.')
      setSelectedCategory(category)
      setSelectedSubCategory(subCategory)
    } else {
      // It's a main category selection
      setSelectedCategory(filterValue)
      setSelectedSubCategory(null)
    }
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
      
      {/* Products Grid Section */}
      <ProductsGrid 
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        title={selectedCategory ? null : t('home.featuredProducts')} 
      />
      
      {/* Customer Reviews */}
      <Reviews />
    </div>
  )
}

export default Home