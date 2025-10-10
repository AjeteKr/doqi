import React from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    category,
    price,
    stock,
    colors = [],
    image,
    description
  } = product

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img 
          src={image || "/api/placeholder/400/300"} 
          alt={name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {price}
            </span>
          </div>
          <span className={`text-sm px-2 py-1 rounded ${
            stock === 'In stock' 
              ? 'text-green-700 bg-green-100' 
              : 'text-red-700 bg-red-100'
          }`}>
            {stock}
          </span>
        </div>
        
        {colors.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-600">Available colors:</span>
            <div className="flex space-x-2 mt-1">
              {colors.map((color, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <Link 
          to={`/products/${id}`}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default ProductCard