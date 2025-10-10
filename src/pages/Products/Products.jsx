import React, { useState, useEffect } from 'react'
import ProductsGrid from '../../components/ProductsGrid'

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  // Categories for filtering
  const categories = ['All', 'Kitchen', 'Bedroom', 'Living Room', 'Mattresses']

  useEffect(() => {
    // This will be replaced with actual API call later
    // For now, we'll use empty array or load from JSON
    const loadProducts = async () => {
      try {
        // Simulating API call
        setTimeout(() => {
          setProducts([])
          setFilteredProducts([])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error loading products:', error)
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory))
    }
  }, [products, selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
            <p className="text-lg text-gray-600">
              Explore our complete range of high-quality furniture and mattresses
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <ProductsGrid 
        products={filteredProducts} 
        title={`${selectedCategory === 'All' ? 'All' : selectedCategory} Products`}
      />
    </div>
  )
}

export default Products