import React from 'react'
import Hero from '../../components/Hero'
import ProductsGrid from '../../components/ProductsGrid'
import Reviews from '../../components/Reviews'

const Home = () => {
  // This will be replaced with actual data from context/API later
  const featuredProducts = []

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Featured Products Section */}
      <ProductsGrid 
        products={featuredProducts.slice(0, 6)} 
        title="Featured Products" 
      />
      
      {/* Company Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              About DoqiSHPK
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-600 mb-6">
                Doçi Shpk, in partnership with Starflex, brings together years of experience 
                in high-quality furniture and mattress production. With a modern factory, 
                advanced technology, and a passion for design, we deliver products that 
                combine comfort, durability, and style.
              </p>
              <p className="text-lg text-gray-600">
                Our commitment to excellence ensures that every piece of furniture and 
                every mattress meets the highest standards of quality and craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Reviews />
    </div>
  )
}

export default Home