const ProductCard = ({ product }) => {
  const {
    id,
    title,
    image
  } = product

  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
      {/* Heart/Favorite Icon */}
      <div className="relative">
        <img 
          src={image || "/api/placeholder/400/300"} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard