import React from 'react'
import Hero from '../../components/Hero'
import AboutSection from '../../components/AboutSection'
import LatestArrivals from '../../components/LatestArrivals'
import ProductsGrid from '../../components/ProductsGrid'
import Reviews from '../../components/Reviews'

const Home = () => {
  // This will be replaced with actual data from context/API later
  const featuredProducts = []

  return (
    <div className="min-h-screen">
      <Hero />
      <AboutSection />
      <LatestArrivals />
      
      {/* Featured Products Section */}
      <ProductsGrid 
        products={featuredProducts.slice(0, 6)} 
        title="Featured Products" 
      />
      
      <Reviews />
    </div>
  )
}

export default Home