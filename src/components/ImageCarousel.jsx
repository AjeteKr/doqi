import { useState, useEffect } from 'react'

const ImageCarousel = ({ 
  images = [
    '/images/hero-bg-1.jpg',
    '/images/hero-bg-2.jpg', 
    '/images/hero-bg-3.jpg'
  ],
  autoPlay = true,
  autoPlayInterval = 5000,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [currentIndex, isAutoPlaying, images.length, autoPlayInterval])

  const goToSlide = (index) => {
    setCurrentIndex(index)
    // Pause auto-play for a moment when user manually navigates
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(autoPlay), 10000) // Resume after 10 seconds
  }

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Image Container */}
      <div className="relative w-full h-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image}), url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
            }}
          />
        ))}

        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 z-5"
          style={{
            background: `linear-gradient(270deg, rgba(217, 217, 217, 0.03) 25.48%, rgba(0, 0, 0, 0.50071) 87.02%, rgba(0, 0, 0, 0.6) 100%)`
          }}
        />
      </div>



      {/* Left Side Navigation Dots (Vertical) */}
      <div className="absolute left-4 lg:left-12 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-125 ${
              index === currentIndex 
                ? 'bg-red-600 ring-2 ring-red-400 ring-opacity-50' 
                : 'bg-red-600/50 hover:bg-red-600/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Optional Arrow Navigation (Hidden by default, can be enabled) */}
      {false && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Next image"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Progress Bar (Optional) */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20">
          <div 
            className="h-full bg-red-600 transition-all duration-100 ease-linear"
            style={{ 
              width: isAutoPlaying ? '100%' : '0%',
              animation: isAutoPlaying ? `progress ${autoPlayInterval}ms linear infinite` : 'none'
            }}
          />
        </div>
      )}

      {/* CSS for progress animation */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}

export default ImageCarousel