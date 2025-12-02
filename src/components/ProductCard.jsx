import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  
  const {
    id,
    title,
    image,
    origin,
    category
  } = product

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

  const handleProductClick = () => {
    const slug = generateSlug(product.title)
    navigate(`/product/${slug}`, { state: { product } })
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    toggleFavorite(product)
  }

  return (
    <div 
      onClick={handleProductClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 hover:border-red-200"
    >
      {/* Heart/Favorite Icon */}
      <div className="relative overflow-hidden">
        <img 
          src={getProductImagePath(image) || "/api/placeholder/400/300"} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
        >
          {isFavorite(id) ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
          )}
        </button>
      </div>
      
      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">{title}</h3>
        {origin && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{origin}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard